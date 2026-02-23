import { expect, Page, test } from "@playwright/test";
import { navigateTo, suffixForProject } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";

const userLastName = "testdelete";

const userUUID = "seb-user-account-delete";

async function setupUserAccountsPage(page: Page, suffix: string) {
    await expect(page.getByTestId("userAccounts-list-container")).toBeVisible();

    const searchFieldLocator = page
        .getByTestId("userAccounts-search-input")
        .getByRole("textbox");
    const searchButtonLocator = page.getByTestId(
        "userAccounts-searchIcon-button",
    );

    const deleteButtonLocator = page.getByTestId(
        `userAccounts-delete-icon-seb-user-account-delete-${suffix}`,
    );

    const deleteDialogLocator = page.getByTestId("userAccounts-delete-dialog");

    const deleteDialogDeleteButtonLocator = page.getByTestId(
        "userAccounts-delete-confirm-button",
    );

    return {
        searchFieldLocator,
        searchButtonLocator,
        deleteButtonLocator,
        deleteDialogLocator,
        deleteDialogDeleteButtonLocator,
    };
}

test.describe("1.4.1 User Accounts - DELETE Remove", () => {
    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        await navigateTo(page, "/user-accounts");
    });

    test("A Success", async ({ page }, testInfo) => {
        const browserSuffix = suffixForProject(testInfo.project.name);
        const userLastNameWithBrowserSuffix =
            userLastName + "-" + browserSuffix;
        const userUUIDWithBrowserSuffix = userUUID + "-" + browserSuffix;

        const deleteRegex = new RegExp(
            `/useraccount/${userUUIDWithBrowserSuffix}(?:$|\\?)`,
            "i",
        );

        const {
            searchFieldLocator,
            searchButtonLocator,
            deleteButtonLocator,
            deleteDialogLocator,
            deleteDialogDeleteButtonLocator,
        } = await setupUserAccountsPage(page, browserSuffix);

        await searchFieldLocator.fill(userLastNameWithBrowserSuffix);

        await searchButtonLocator.click();

        await expect(deleteButtonLocator).toBeVisible();
        await deleteButtonLocator.click();

        await expect(deleteDialogLocator).toBeVisible();
        await expect(deleteDialogDeleteButtonLocator).toBeVisible();

        await expect(deleteDialogDeleteButtonLocator).toHaveText("Delete");

        const deleteRequestPromise = page.waitForRequest(
            (req) => req.method() === "DELETE" && deleteRegex.test(req.url()),
        );

        const deleteResponsePromise = page.waitForResponse(
            (resp) =>
                resp.request().method() === "DELETE" &&
                deleteRegex.test(resp.url()),
        );

        await deleteDialogDeleteButtonLocator.click();

        await deleteDialogDeleteButtonLocator.click();

        const deleteRequest = await deleteRequestPromise;
        const deleteResponse = await deleteResponsePromise;

        expect(deleteRequest.method()).toBe("DELETE");
        expect(deleteRequest.url()).toMatch(deleteRegex);

        expect(deleteResponse.url()).toMatch(deleteRegex);
        expect(deleteResponse.status()).toBe(200);
        expect(deleteResponse.ok()).toBeTruthy();
    });
});
