import type { Page } from "@playwright/test";

import { expect, test } from "../shared/fixtures/table-list-fixtures";
import type { HttpMethod } from "../utils/networkAssertions";
import { connectionConfigurationRowRequests } from "./models/connection-configurations-list.model";

// Fixed shared seed rows (no browser suffix); the read spec relies on the same ids.
const searchName = "e2e-getall-connection-config";
const activeId = 9001;
const inactiveId = 9002;

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
            return route.fallback();
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
    sebConfigPurpose: string;
    date: string;
    active: boolean;
};

const mockRow = (overrides: Partial<MockRow> = {}): MockRow => ({
    id: 9701,
    institutionId: 11,
    name: "mock-row-action-config",
    sebConfigPurpose: "START_EXAM",
    date: "2026-01-01T00:00:00Z",
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
function mockConnectionConfigurationList(
    page: Page,
    state: { rows: MockRow[] },
) {
    return page.route(/\/client_configuration\?/i, (route) => {
        if (route.request().method() !== "GET") {
            return route.fallback();
        }
        return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: listResponse(state.rows),
        });
    });
}

test.describe("04 Connection Configurations - ROW ACTIONS", () => {
    test("A confirming delete fires the delete request and closes the dialog", async ({
        connectionConfigurations,
    }) => {
        const deleteRequest =
            connectionConfigurationRowRequests.delete(activeId);

        await mockOk(
            connectionConfigurations.page,
            deleteRequest,
            "DELETE",
            "HARD_DELETE",
        );

        await connectionConfigurations.goto();
        await connectionConfigurations.expectListRequestSucceeded(() =>
            connectionConfigurations.search(searchName),
        );
        await connectionConfigurations.table.expectRowVisible(activeId);

        const request = await connectionConfigurations.confirmDelete(activeId, {
            request: deleteRequest,
        });
        expect(request.method()).toBe("DELETE");
        expect(request.url()).toMatch(deleteRequest);
    });

    test("B deactivating an active row posts to /inactive", async ({
        connectionConfigurations,
    }) => {
        const deactivateRequest =
            connectionConfigurationRowRequests.deactivate(activeId);

        await mockOk(
            connectionConfigurations.page,
            deactivateRequest,
            "POST",
            "DEACTIVATE",
        );

        await connectionConfigurations.goto();
        await connectionConfigurations.expectListRequestSucceeded(() =>
            connectionConfigurations.search(searchName),
        );
        await connectionConfigurations.table.expectStatusText(
            activeId,
            "Active",
        );

        const request = await connectionConfigurations.confirmStatusChange(
            activeId,
            { method: "POST", request: deactivateRequest },
        );
        expect(request.url()).toMatch(deactivateRequest);
    });

    test("C activating an inactive row posts to /active", async ({
        connectionConfigurations,
    }) => {
        const activateRequest =
            connectionConfigurationRowRequests.activate(inactiveId);

        await mockOk(
            connectionConfigurations.page,
            activateRequest,
            "POST",
            "ACTIVATE",
        );

        await connectionConfigurations.goto();
        await connectionConfigurations.expectListRequestSucceeded(() =>
            connectionConfigurations.search(searchName),
        );
        await connectionConfigurations.table.expectStatusText(
            inactiveId,
            "Inactive",
        );

        const request = await connectionConfigurations.confirmStatusChange(
            inactiveId,
            { method: "POST", request: activateRequest },
        );
        expect(request.url()).toMatch(activateRequest);
    });

    test("D a delete that fails on the report keeps the row and surfaces an error", async ({
        connectionConfigurations,
    }) => {
        const page = connectionConfigurations.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deleteRequest = connectionConfigurationRowRequests.delete(row.id);

        await mockConnectionConfigurationList(page, state);
        await page.route(deleteRequest, (route) => {
            if (route.request().method() !== "DELETE") {
                return route.fallback();
            }
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: failedReport("HARD_DELETE"),
            });
        });

        await connectionConfigurations.goto();
        await connectionConfigurations.table.expectRowVisible(row.id);

        await connectionConfigurations.confirmDelete(row.id, {
            request: deleteRequest,
        });

        // The op logically failed, so the row must survive and the user must be told.
        await connectionConfigurations.table.expectRowVisible(row.id);
        await expect(
            page.locator(".v-snackbar__content").first(),
        ).toBeVisible();
    });

    test("E a deactivate that fails on the report keeps the row active and surfaces an error", async ({
        connectionConfigurations,
    }) => {
        const page = connectionConfigurations.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deactivateRequest = connectionConfigurationRowRequests.deactivate(
            row.id,
        );

        await mockConnectionConfigurationList(page, state);
        await page.route(deactivateRequest, (route) => {
            if (route.request().method() !== "POST") {
                return route.fallback();
            }
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: failedReport("DEACTIVATE"),
            });
        });

        await connectionConfigurations.goto();
        await connectionConfigurations.table.expectStatusText(row.id, "Active");

        await connectionConfigurations.confirmStatusChange(row.id, {
            method: "POST",
            request: deactivateRequest,
        });

        // The op logically failed, so the status must not flip and the user must be told.
        await connectionConfigurations.table.expectStatusText(row.id, "Active");
        await expect(
            page.locator(".v-snackbar__content").first(),
        ).toBeVisible();
    });

    test("F a successful delete removes the row from the list", async ({
        connectionConfigurations,
    }) => {
        const page = connectionConfigurations.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deleteRequest = connectionConfigurationRowRequests.delete(row.id);

        await mockConnectionConfigurationList(page, state);
        await page.route(deleteRequest, (route) => {
            if (route.request().method() !== "DELETE") {
                return route.fallback();
            }
            state.rows = state.rows.filter((r) => r.id !== row.id);
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: report("HARD_DELETE"),
            });
        });

        await connectionConfigurations.goto();
        await connectionConfigurations.table.expectRowVisible(row.id);

        await connectionConfigurations.confirmDelete(row.id, {
            request: deleteRequest,
        });

        await connectionConfigurations.table.expectRowAbsent(row.id);
    });

    test("G a successful deactivate flips the row status to Inactive", async ({
        connectionConfigurations,
    }) => {
        const page = connectionConfigurations.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deactivateRequest = connectionConfigurationRowRequests.deactivate(
            row.id,
        );

        await mockConnectionConfigurationList(page, state);
        await page.route(deactivateRequest, (route) => {
            if (route.request().method() !== "POST") {
                return route.fallback();
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

        await connectionConfigurations.goto();
        await connectionConfigurations.table.expectStatusText(row.id, "Active");

        await connectionConfigurations.confirmStatusChange(row.id, {
            method: "POST",
            request: deactivateRequest,
        });

        await connectionConfigurations.table.expectStatusText(
            row.id,
            "Inactive",
        );
    });

    test("H a deactivated row appears when switching to the Inactive filter", async ({
        connectionConfigurations,
    }) => {
        const page = connectionConfigurations.page;
        const row = mockRow();
        const state = { rows: [row] };
        const deactivateRequest = connectionConfigurationRowRequests.deactivate(
            row.id,
        );

        await page.route(/\/client_configuration\?/i, (route) => {
            if (route.request().method() !== "GET") {
                return route.fallback();
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
                return route.fallback();
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

        await connectionConfigurations.goto();
        await connectionConfigurations.table.expectRowVisible(row.id);

        await test.step("visit the Inactive filter first so its page is cached", async () => {
            await connectionConfigurations.expectListRequestSucceeded(() =>
                connectionConfigurations.toggleStatusFilter("Inactive"),
            );
            await connectionConfigurations.table.expectRowAbsent(row.id);
        });

        await test.step("back on the Active filter, deactivate the row", async () => {
            await connectionConfigurations.expectListRequestSucceeded(() =>
                connectionConfigurations.toggleStatusFilter("Active"),
            );
            await connectionConfigurations.table.expectStatusText(
                row.id,
                "Active",
            );
            await connectionConfigurations.confirmStatusChange(row.id, {
                method: "POST",
                request: deactivateRequest,
            });
        });

        await test.step("the Inactive filter now shows the freshly deactivated row", async () => {
            await connectionConfigurations.toggleStatusFilter("Inactive");
            await connectionConfigurations.table.expectRowVisible(row.id);
            await connectionConfigurations.table.expectStatusText(
                row.id,
                "Inactive",
            );
        });
    });
});
