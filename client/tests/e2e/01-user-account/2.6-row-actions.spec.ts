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
});
