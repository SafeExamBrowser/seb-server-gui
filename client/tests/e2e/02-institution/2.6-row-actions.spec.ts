import { test, expect } from "../shared/fixtures/table-list-fixtures";
import type { HttpMethod } from "../utils/networkAssertions";
import {
    INSTITUTION_LIST_REQUEST,
    institutionRowRequests,
} from "./models/institutions-list.model";
import type { Page } from "@playwright/test";

const searchName = "Test";
const activeInstitutionId = 11;
const inactiveInstitutionId = 12;

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
    id: number;
    name: string;
    urlSuffix: string;
    active: boolean;
};

const mockRow = (overrides: Partial<MockRow> = {}): MockRow => ({
    id: 9701,
    name: "mock-row-action-institution",
    urlSuffix: "mock-row-action-institution",
    active: true,
    ...overrides,
});

const seededRows = (): MockRow[] => [
    mockRow({
        id: activeInstitutionId,
        name: "Test Active Institution",
        urlSuffix: "test-active-institution",
        active: true,
    }),
    mockRow({
        id: inactiveInstitutionId,
        name: "Test Inactive Institution",
        urlSuffix: "test-inactive-institution",
        active: false,
    }),
];

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
function mockInstitutionList(page: Page, state: { rows: MockRow[] }) {
    return page.route(INSTITUTION_LIST_REQUEST, (route) => {
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

test.describe("02 Institutions - ROW ACTIONS", () => {
    test("A confirming delete fires the delete request and closes the dialog", async ({
        institutions,
    }) => {
        const deleteRequest =
            institutionRowRequests.delete(activeInstitutionId);
        const state = { rows: seededRows() };

        await mockInstitutionList(institutions.page, state);
        await mockOk(institutions.page, deleteRequest, "DELETE", "HARD_DELETE");

        await institutions.goto();
        await institutions.expectListRequestSucceeded(() =>
            institutions.search(searchName),
        );
        await institutions.table.expectRowVisible(activeInstitutionId);

        const request = await institutions.confirmDelete(activeInstitutionId, {
            request: deleteRequest,
        });
        expect(request.method()).toBe("DELETE");
        expect(request.url()).toMatch(deleteRequest);
    });

    test("B deactivating an active row posts to /inactive", async ({
        institutions,
    }) => {
        const deactivateRequest =
            institutionRowRequests.deactivate(activeInstitutionId);
        const state = { rows: seededRows() };

        await mockInstitutionList(institutions.page, state);
        await mockOk(
            institutions.page,
            deactivateRequest,
            "POST",
            "DEACTIVATE",
        );

        await institutions.goto();
        await institutions.expectListRequestSucceeded(() =>
            institutions.search(searchName),
        );
        await institutions.table.expectStatusText(
            activeInstitutionId,
            "Active",
        );

        const request = await institutions.confirmStatusChange(
            activeInstitutionId,
            { method: "POST", request: deactivateRequest },
        );
        expect(request.url()).toMatch(deactivateRequest);
    });

    test("C activating an inactive row posts to /active", async ({
        institutions,
    }) => {
        const activateRequest = institutionRowRequests.activate(
            inactiveInstitutionId,
        );
        const state = { rows: seededRows() };

        await mockInstitutionList(institutions.page, state);
        await mockOk(institutions.page, activateRequest, "POST", "ACTIVATE");

        await institutions.goto();
        await institutions.expectListRequestSucceeded(() =>
            institutions.search(searchName),
        );
        await institutions.table.expectStatusText(
            inactiveInstitutionId,
            "Inactive",
        );

        const request = await institutions.confirmStatusChange(
            inactiveInstitutionId,
            { method: "POST", request: activateRequest },
        );
        expect(request.url()).toMatch(activateRequest);
    });

    test("D a delete that fails on the report keeps the row and surfaces an error", async ({
        institutions,
    }) => {
        const page = institutions.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deleteRequest = institutionRowRequests.delete(row.id);

        await mockInstitutionList(page, state);
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

        await institutions.goto();
        await institutions.table.expectRowVisible(row.id);

        await institutions.confirmDelete(row.id, { request: deleteRequest });

        // The op logically failed, so the row must survive and the user must be told.
        await institutions.table.expectRowVisible(row.id);
        await expect(
            page.locator(".v-snackbar__content").first(),
        ).toBeVisible();
    });

    test("E a deactivate that fails on the report keeps the row active and surfaces an error", async ({
        institutions,
    }) => {
        const page = institutions.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deactivateRequest = institutionRowRequests.deactivate(row.id);

        await mockInstitutionList(page, state);
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

        await institutions.goto();
        await institutions.table.expectStatusText(row.id, "Active");

        await institutions.confirmStatusChange(row.id, {
            method: "POST",
            request: deactivateRequest,
        });

        // The op logically failed, so the status must not flip and the user must be told.
        await institutions.table.expectStatusText(row.id, "Active");
        await expect(
            page.locator(".v-snackbar__content").first(),
        ).toBeVisible();
    });

    test("F a successful delete removes the row from the list", async ({
        institutions,
    }) => {
        const page = institutions.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deleteRequest = institutionRowRequests.delete(row.id);

        await mockInstitutionList(page, state);
        await page.route(deleteRequest, (route) => {
            if (route.request().method() !== "DELETE") {
                return route.continue();
            }
            state.rows = state.rows.filter((r) => r.id !== row.id);
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: report("HARD_DELETE"),
            });
        });

        await institutions.goto();
        await institutions.table.expectRowVisible(row.id);

        await institutions.confirmDelete(row.id, { request: deleteRequest });

        await institutions.table.expectRowAbsent(row.id);
    });

    test("G a successful deactivate flips the row status to Inactive", async ({
        institutions,
    }) => {
        const page = institutions.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deactivateRequest = institutionRowRequests.deactivate(row.id);

        await mockInstitutionList(page, state);
        await page.route(deactivateRequest, (route) => {
            if (route.request().method() !== "POST") {
                return route.continue();
            }
            state.rows = state.rows.map((r) =>
                r.id === row.id ? { ...r, active: false } : r,
            );
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: report("DEACTIVATE"),
            });
        });

        await institutions.goto();
        await institutions.table.expectStatusText(row.id, "Active");

        await institutions.confirmStatusChange(row.id, {
            method: "POST",
            request: deactivateRequest,
        });

        await institutions.table.expectStatusText(row.id, "Inactive");
    });

    test("H a deactivated row appears when switching to the Inactive filter", async ({
        institutions,
    }) => {
        const page = institutions.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deactivateRequest = institutionRowRequests.deactivate(row.id);

        await page.route(INSTITUTION_LIST_REQUEST, (route) => {
            if (route.request().method() !== "GET") {
                return route.continue();
            }
            const active = new URL(route.request().url()).searchParams.get(
                "active",
            );
            const rows =
                active === null
                    ? state.rows
                    : state.rows.filter((r) => String(r.active) === active);
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: listResponse(rows),
            });
        });
        await page.route(deactivateRequest, (route) => {
            if (route.request().method() !== "POST") {
                return route.continue();
            }
            state.rows = state.rows.map((r) =>
                r.id === row.id ? { ...r, active: false } : r,
            );
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: report("DEACTIVATE"),
            });
        });

        await institutions.goto();
        await institutions.table.expectRowVisible(row.id);

        await test.step("visit the Inactive filter first so its page is cached", async () => {
            await institutions.expectListRequestSucceeded(() =>
                institutions.toggleStatusFilter("Inactive"),
            );
            await institutions.table.expectRowAbsent(row.id);
        });

        await test.step("back on the Active filter, deactivate the row", async () => {
            await institutions.expectListRequestSucceeded(() =>
                institutions.toggleStatusFilter("Active"),
            );
            await institutions.table.expectStatusText(row.id, "Active");
            await institutions.confirmStatusChange(row.id, {
                method: "POST",
                request: deactivateRequest,
            });
        });

        await test.step("the Inactive filter now shows the freshly deactivated row", async () => {
            await institutions.toggleStatusFilter("Inactive");
            await institutions.table.expectRowVisible(row.id);
            await institutions.table.expectStatusText(row.id, "Inactive");
        });
    });
});
