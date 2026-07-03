import { test, expect } from "../shared/fixtures/table-list-fixtures";
import type { HttpMethod } from "../utils/networkAssertions";
import { assessmentToolRowRequests } from "./models/assessment-tools-list.model";
import type { Page } from "@playwright/test";

// Fixed shared seed rows (no browser suffix); the read spec relies on the same ids.
const searchName = "e2e-getall-assessment-tool";
const activeId = 9101;
const inactiveId = 9102;

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
    institutionId: number;
    name: string;
    lmsType: string;
    active: boolean;
};

const mockRow = (overrides: Partial<MockRow> = {}): MockRow => ({
    id: 9701,
    institutionId: 11,
    name: "mock-row-action-tool",
    lmsType: "MOCKUP",
    active: true,
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
function mockAssessmentToolList(page: Page, state: { rows: MockRow[] }) {
    return page.route(/\/lms-setup\?/i, (route) => {
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

test.describe("05 Assessment Tools - ROW ACTIONS", () => {
    test("A confirming delete fires the delete request and closes the dialog", async ({
        assessmentTools,
    }) => {
        const deleteRequest = assessmentToolRowRequests.delete(activeId);

        await mockOk(
            assessmentTools.page,
            deleteRequest,
            "DELETE",
            "HARD_DELETE",
        );

        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search(searchName),
        );
        await assessmentTools.table.expectRowVisible(activeId);

        const request = await assessmentTools.confirmDelete(activeId, {
            request: deleteRequest,
        });
        expect(request.method()).toBe("DELETE");
        expect(request.url()).toMatch(deleteRequest);
    });

    test("B deactivating an active row posts to /inactive", async ({
        assessmentTools,
    }) => {
        const deactivateRequest =
            assessmentToolRowRequests.deactivate(activeId);

        await mockOk(
            assessmentTools.page,
            deactivateRequest,
            "POST",
            "DEACTIVATE",
        );

        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search(searchName),
        );
        await assessmentTools.table.expectStatusText(activeId, "Active");

        const request = await assessmentTools.confirmStatusChange(activeId, {
            method: "POST",
            request: deactivateRequest,
        });
        expect(request.url()).toMatch(deactivateRequest);
    });

    test("C activating an inactive row posts to /active", async ({
        assessmentTools,
    }) => {
        const activateRequest = assessmentToolRowRequests.activate(inactiveId);

        await mockOk(assessmentTools.page, activateRequest, "POST", "ACTIVATE");

        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search(searchName),
        );
        await assessmentTools.table.expectStatusText(inactiveId, "Inactive");

        const request = await assessmentTools.confirmStatusChange(inactiveId, {
            method: "POST",
            request: activateRequest,
        });
        expect(request.url()).toMatch(activateRequest);
    });

    test("D a delete that fails on the report keeps the row and surfaces an error", async ({
        assessmentTools,
    }) => {
        const page = assessmentTools.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deleteRequest = assessmentToolRowRequests.delete(row.id);

        await mockAssessmentToolList(page, state);
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

        await assessmentTools.goto();
        await assessmentTools.table.expectRowVisible(row.id);

        await assessmentTools.confirmDelete(row.id, {
            request: deleteRequest,
        });

        // The op logically failed, so the row must survive and the user must be told.
        await assessmentTools.table.expectRowVisible(row.id);
        await expect(
            page.locator(".v-snackbar__content").first(),
        ).toBeVisible();
    });

    test("E a deactivate that fails on the report keeps the row active and surfaces an error", async ({
        assessmentTools,
    }) => {
        const page = assessmentTools.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deactivateRequest = assessmentToolRowRequests.deactivate(row.id);

        await mockAssessmentToolList(page, state);
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

        await assessmentTools.goto();
        await assessmentTools.table.expectStatusText(row.id, "Active");

        await assessmentTools.confirmStatusChange(row.id, {
            method: "POST",
            request: deactivateRequest,
        });

        // The op logically failed, so the status must not flip and the user must be told.
        await assessmentTools.table.expectStatusText(row.id, "Active");
        await expect(
            page.locator(".v-snackbar__content").first(),
        ).toBeVisible();
    });

    test("F a successful delete removes the row from the list", async ({
        assessmentTools,
    }) => {
        const page = assessmentTools.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deleteRequest = assessmentToolRowRequests.delete(row.id);

        await mockAssessmentToolList(page, state);
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

        await assessmentTools.goto();
        await assessmentTools.table.expectRowVisible(row.id);

        await assessmentTools.confirmDelete(row.id, {
            request: deleteRequest,
        });

        await assessmentTools.table.expectRowAbsent(row.id);
    });

    test("G a successful deactivate flips the row status to Inactive", async ({
        assessmentTools,
    }) => {
        const page = assessmentTools.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deactivateRequest = assessmentToolRowRequests.deactivate(row.id);

        await mockAssessmentToolList(page, state);
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

        await assessmentTools.goto();
        await assessmentTools.table.expectStatusText(row.id, "Active");

        await assessmentTools.confirmStatusChange(row.id, {
            method: "POST",
            request: deactivateRequest,
        });

        await assessmentTools.table.expectStatusText(row.id, "Inactive");
    });
});
