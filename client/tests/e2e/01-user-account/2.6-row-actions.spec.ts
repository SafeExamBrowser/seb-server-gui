import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { addBrowserSuffixToText } from "../utils/helpers";
import type { HttpMethod } from "../utils/networkAssertions";
import { userAccountRowRequests } from "./models/user-accounts-list.model";
import type { Page } from "@playwright/test";

const searchSurname = "000-testgetall";
const activeUserUuid = "seb-user-account-getall-active";
const inactiveUserUuid = "seb-user-account-getall-inactive";

type BulkActionType = "HARD_DELETE" | "ACTIVATE" | "DEACTIVATE";

const report = (bulkActionType: BulkActionType) =>
    JSON.stringify({ source: [], results: [], errors: [], bulkActionType });

// A 200 EntityProcessingReport whose errors[] is populated: the API's "the HTTP call
// succeeded but the operation failed" shape. entityProcessingReportToAppError turns a
// non-empty errors[] into a thrown AppError, so the mutation rejects, the optimistic
// list update and the follow-up reloadList never run, and the user is shown an error.
const failedReport = (bulkActionType: BulkActionType) =>
    JSON.stringify({
        source: [],
        results: [],
        errors: [
            {
                error_message: {
                    messageCode: "1370",
                    systemMessage: "The operation could not be completed.",
                    attributes: [],
                },
            },
        ],
        bulkActionType,
    });

// Mutations are mocked so the seeded rows survive and the specs stay re-runnable;
// the assertions verify the right endpoint fires, not real backend state changes.
async function mockOk(
    page: Page,
    urlRegex: RegExp,
    method: HttpMethod,
    bulkActionType: BulkActionType,
) {
    await page.route(urlRegex, (route) => {
        if (route.request().method() !== method) {
            return route.continue();
        }
        return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: report(bulkActionType),
        });
    });
}

type MockRow = {
    uuid: string;
    institutionId: number;
    name: string;
    surname: string;
    username: string;
    email: string;
    active: boolean;
    language: string;
    timezone: string;
    userRoles: string[];
};

const mockRow = (overrides: Partial<MockRow> = {}): MockRow => ({
    uuid: "mock-row-action-user",
    institutionId: 11,
    name: "Mock",
    surname: "RowAction",
    username: "mock-row-action",
    email: "mock-row-action@example.com",
    active: true,
    language: "en",
    timezone: "UTC",
    userRoles: ["EXAM_ADMIN"],
    ...overrides,
});

const listResponse = (rows: MockRow[]) =>
    JSON.stringify({
        number_of_pages: 1,
        page_number: 1,
        page_size: 10,
        content: rows,
    });

// A successful delete/deactivate runs an optimistic cache update AND a reloadList refetch.
// A mocked mutation can't persist, so against the real backend the refetch would re-show the
// row and mask the outcome. The outcome specs therefore serve the list from an in-memory
// `state.rows` the action route mutates, so the refetch reflects the new backend state.
function mockUserAccountList(page: Page, state: { rows: MockRow[] }) {
    return page.route(/\/useraccount\?/i, (route) => {
        if (route.request().method() !== "GET") {
            return route.continue();
        }
        return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: listResponse(state.rows),
        });
    });
}

test.describe("01 User Accounts - ROW ACTIONS", () => {
    test("A confirming delete fires the delete request and closes the dialog", async ({
        userAccounts,
    }, testInfo) => {
        const surname = addBrowserSuffixToText(searchSurname, testInfo);
        const activeId = addBrowserSuffixToText(activeUserUuid, testInfo);
        const deleteRequest = userAccountRowRequests.delete(activeId);

        await mockOk(userAccounts.page, deleteRequest, "DELETE", "HARD_DELETE");

        await userAccounts.goto();
        await userAccounts.expectListRequestSucceeded(() =>
            userAccounts.search(surname),
        );
        await userAccounts.table.expectRowVisible(activeId);

        const request = await userAccounts.confirmDelete(activeId, {
            request: deleteRequest,
        });
        expect(request.method()).toBe("DELETE");
        expect(request.url()).toMatch(deleteRequest);
    });

    test("B deactivating an active row posts to /inactive", async ({
        userAccounts,
    }, testInfo) => {
        const surname = addBrowserSuffixToText(searchSurname, testInfo);
        const activeId = addBrowserSuffixToText(activeUserUuid, testInfo);
        const deactivateRequest = userAccountRowRequests.deactivate(activeId);

        await mockOk(
            userAccounts.page,
            deactivateRequest,
            "POST",
            "DEACTIVATE",
        );

        await userAccounts.goto();
        await userAccounts.expectListRequestSucceeded(() =>
            userAccounts.search(surname),
        );
        await userAccounts.table.expectStatusText(activeId, "Active");

        const request = await userAccounts.confirmStatusChange(activeId, {
            method: "POST",
            request: deactivateRequest,
        });
        expect(request.url()).toMatch(deactivateRequest);
    });

    test("C activating an inactive row posts to /active", async ({
        userAccounts,
    }, testInfo) => {
        const surname = addBrowserSuffixToText(searchSurname, testInfo);
        const inactiveId = addBrowserSuffixToText(inactiveUserUuid, testInfo);
        const activateRequest = userAccountRowRequests.activate(inactiveId);

        await mockOk(userAccounts.page, activateRequest, "POST", "ACTIVATE");

        await userAccounts.goto();
        await userAccounts.expectListRequestSucceeded(() =>
            userAccounts.search(surname),
        );
        await userAccounts.table.expectStatusText(inactiveId, "Inactive");

        const request = await userAccounts.confirmStatusChange(inactiveId, {
            method: "POST",
            request: activateRequest,
        });
        expect(request.url()).toMatch(activateRequest);
    });

    test("D a delete that fails on the report keeps the row and surfaces an error", async ({
        userAccounts,
    }) => {
        const page = userAccounts.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deleteRequest = userAccountRowRequests.delete(row.uuid);

        await mockUserAccountList(page, state);
        await page.route(deleteRequest, (route) => {
            if (route.request().method() !== "DELETE") {
                return route.continue();
            }
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: failedReport("HARD_DELETE"),
            });
        });

        await userAccounts.goto();
        await userAccounts.table.expectRowVisible(row.uuid);

        await userAccounts.confirmDelete(row.uuid, { request: deleteRequest });

        // The op logically failed, so the row must survive and the user must be told.
        await userAccounts.table.expectRowVisible(row.uuid);
        await expect(
            page.locator(".v-snackbar__content").first(),
        ).toBeVisible();
    });

    test("E a deactivate that fails on the report keeps the row active and surfaces an error", async ({
        userAccounts,
    }) => {
        const page = userAccounts.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deactivateRequest = userAccountRowRequests.deactivate(row.uuid);

        await mockUserAccountList(page, state);
        await page.route(deactivateRequest, (route) => {
            if (route.request().method() !== "POST") {
                return route.continue();
            }
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: failedReport("DEACTIVATE"),
            });
        });

        await userAccounts.goto();
        await userAccounts.table.expectStatusText(row.uuid, "Active");

        await userAccounts.confirmStatusChange(row.uuid, {
            method: "POST",
            request: deactivateRequest,
        });

        // The op logically failed, so the status must not flip and the user must be told.
        await userAccounts.table.expectStatusText(row.uuid, "Active");
        await expect(
            page.locator(".v-snackbar__content").first(),
        ).toBeVisible();
    });

    test("F a successful delete removes the row from the list", async ({
        userAccounts,
    }) => {
        const page = userAccounts.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deleteRequest = userAccountRowRequests.delete(row.uuid);

        await mockUserAccountList(page, state);
        await page.route(deleteRequest, (route) => {
            if (route.request().method() !== "DELETE") {
                return route.continue();
            }
            state.rows = state.rows.filter((r) => r.uuid !== row.uuid);
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: report("HARD_DELETE"),
            });
        });

        await userAccounts.goto();
        await userAccounts.table.expectRowVisible(row.uuid);

        await userAccounts.confirmDelete(row.uuid, { request: deleteRequest });

        await userAccounts.table.expectRowAbsent(row.uuid);
    });

    test("G a successful deactivate flips the row status to Inactive", async ({
        userAccounts,
    }) => {
        const page = userAccounts.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deactivateRequest = userAccountRowRequests.deactivate(row.uuid);

        await mockUserAccountList(page, state);
        await page.route(deactivateRequest, (route) => {
            if (route.request().method() !== "POST") {
                return route.continue();
            }
            state.rows = state.rows.map((r) =>
                r.uuid === row.uuid ? { ...r, active: false } : r,
            );
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: report("DEACTIVATE"),
            });
        });

        await userAccounts.goto();
        await userAccounts.table.expectStatusText(row.uuid, "Active");

        await userAccounts.confirmStatusChange(row.uuid, {
            method: "POST",
            request: deactivateRequest,
        });

        await userAccounts.table.expectStatusText(row.uuid, "Inactive");
    });
});
