import { expect, Page, test } from "@playwright/test";
import { navigateTo, suffixForProject } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";

const userLastName = "testactive";
const userUUID = "seb-inst-admin-active";

async function setupUserAccountsPage(page: Page, suffix: string) {
    await expect(page.getByTestId("userAccounts-list-container")).toBeVisible();

    const searchFieldLocator = page
        .getByTestId("userAccounts-search-input")
        .getByRole("textbox");
    const searchButtonLocator = page.getByTestId(
        "userAccounts-searchIcon-button",
    );

    const activateButtonLocator = page.getByTestId(
        `userAccounts-status-chip-seb-inst-admin-active-${suffix}`,
    );
    const statusDialogLocator = page.getByTestId("userAccounts-status-dialog");
    const statusDialogActivateButtonLocator = page.getByTestId(
        "userAccounts-status-confirm-button",
    );

    return {
        searchFieldLocator,
        searchButtonLocator,
        activateButtonLocator,
        statusDialogLocator,
        statusDialogActivateButtonLocator,
    };
}

test.describe("1.3.3 User Accounts - UPDATE Deactivate", () => {
    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        await navigateTo(page, "/user-accounts");
    });

    test("A Success", async ({ page }, testInfo) => {
        const browserSuffix = suffixForProject(testInfo.project.name);
        const userLastNameWithBrowserSuffix =
            userLastName + "-" + browserSuffix;
        const userUUIDWithBrowserSuffix = userUUID + "-" + browserSuffix;
        const deactivateRegex = new RegExp(
            `/useraccount/${userUUIDWithBrowserSuffix}/inactive(?:\\?|$)`,
            "i",
        );

        const {
            searchFieldLocator,
            searchButtonLocator,
            activateButtonLocator,
            statusDialogLocator,
            statusDialogActivateButtonLocator,
        } = await setupUserAccountsPage(page, browserSuffix);

        await searchFieldLocator.fill(userLastNameWithBrowserSuffix);

        await searchButtonLocator.click();

        await expect(activateButtonLocator).toBeVisible();
        await expect(activateButtonLocator).toHaveText("Active");

        await activateButtonLocator.click();

        await expect(statusDialogLocator).toBeVisible();

        await expect(statusDialogActivateButtonLocator).toHaveText(
            "Deactivate",
        );

        const activateRequestPromise = page.waitForRequest(
            (req) => req.method() === "POST" && deactivateRegex.test(req.url()),
        );

        const activateResponsePromise = page.waitForResponse(
            (resp) =>
                resp.request().method() === "POST" &&
                deactivateRegex.test(resp.url()),
        );

        await statusDialogActivateButtonLocator.click();

        const activateRequest = await activateRequestPromise;
        const activateResponse = await activateResponsePromise;

        expect(activateRequest.method()).toBe("POST");
        expect(activateRequest.url()).toMatch(deactivateRegex);

        expect(activateResponse.url()).toMatch(deactivateRegex);
        expect(activateResponse.status()).toBe(200);
        expect(activateResponse.ok()).toBeTruthy();

        await expect(activateButtonLocator).toHaveText("Inactive");
    });
});
