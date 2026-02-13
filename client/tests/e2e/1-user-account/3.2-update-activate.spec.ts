import { expect, Page, test } from "@playwright/test";
import { navigateTo, suffixForProject } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";

const userLastName = "testinactive";
const userUUID = "seb-inst-admin-inactive";

async function setupUserAccountsPage(page: Page, suffix: string) {
    await expect(page.getByTestId("userAccounts-list-container")).toBeVisible();

    const searchFieldLocator = page
        .getByTestId("userAccounts-search-input")
        .getByRole("textbox");
    const searchButtonLocator = page.getByTestId(
        "userAccounts-searchIcon-button",
    );

    //this needs suffix
    const activateButtonLocator = page.getByTestId(
        `userAccounts-status-chip-seb-inst-admin-inactive-${suffix}`,
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

test.describe("1.3.2 User Accounts - UPDATE Activate", () => {
    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        await navigateTo(page, "/user-accounts");
    });

    test("A Success", async ({ page }, testInfo) => {
        const browserSuffix = suffixForProject(testInfo.project.name);
        const userLastNameWithBrowserSuffix =
            userLastName + "-" + browserSuffix;
        const userUUIDWithBrowserSuffix = userUUID + "-" + browserSuffix;
        const activateRegex = new RegExp(
            `/useraccount/${userUUIDWithBrowserSuffix}/active(?:\\?|$)`,
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
        await expect(activateButtonLocator).toHaveText("Inactive");

        await activateButtonLocator.click();

        await expect(statusDialogLocator).toBeVisible();

        await expect(statusDialogActivateButtonLocator).toHaveText("Activate");

        const activateRequestPromise = page.waitForRequest(
            (req) => req.method() === "POST" && activateRegex.test(req.url()),
        );

        const activateResponsePromise = page.waitForResponse(
            (resp) =>
                resp.request().method() === "POST" &&
                activateRegex.test(resp.url()),
        );

        await statusDialogActivateButtonLocator.click();

        const activateRequest = await activateRequestPromise;
        const activateResponse = await activateResponsePromise;

        //this needs suffix
        expect(activateRequest.method()).toBe("POST");
        expect(activateRequest.url()).toMatch(activateRegex);

        expect(activateResponse.url()).toMatch(activateRegex);
        expect(activateResponse.status()).toBe(200);
        expect(activateResponse.ok()).toBeTruthy();

        // 8. verify the v-chip text is now "Active"
        await expect(activateButtonLocator).toHaveText("Active");
    });
});
