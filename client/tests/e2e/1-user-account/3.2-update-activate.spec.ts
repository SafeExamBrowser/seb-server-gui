import { expect, test } from "@playwright/test";
import { addBrowserSuffixToText } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";
import { PlaywrightUserAccountsPage } from "../models/playwright-user-accounts-page";

const userLastName = "testinactive";
const userUUID = "seb-inst-admin-inactive";

test.describe("1.3.2 User Accounts - UPDATE Activate", () => {
    let userAccountsPage: PlaywrightUserAccountsPage;

    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        userAccountsPage = new PlaywrightUserAccountsPage(page);
        await userAccountsPage.goto();
        await userAccountsPage.expectVisible();
    });

    test("A Success", async ({ page }, testInfo) => {
        expect(page.url()).toContain("/user-accounts");

        //generate brwoser specific values
        const userLastNameWithBrowserSuffix = addBrowserSuffixToText(
            userLastName,
            testInfo,
        );

        const userUUIDWithBrowserSuffix = addBrowserSuffixToText(
            userUUID,
            testInfo,
        );

        //search for user
        await userAccountsPage.search(userLastNameWithBrowserSuffix);

        //verify user is visible and correct values
        await userAccountsPage.expectRowVisible(userUUIDWithBrowserSuffix);
        await userAccountsPage.expectStatusText(
            userUUIDWithBrowserSuffix,
            "Inactive",
        );

        //click status
        await userAccountsPage.clickStatusChip(userUUIDWithBrowserSuffix);

        //verify dialog shows and button is correct
        await userAccountsPage.expectStatusDialogVisible();
        await expect(userAccountsPage.statusConfirmButton).toHaveText(
            "Activate",
        );

        //click ACTIVATE and assert network request
        await userAccountsPage.expectActivateRequestSucceeded(
            userUUIDWithBrowserSuffix,
            async () => {
                await userAccountsPage.confirmStatusChange();
            },
        );

        await userAccountsPage.expectStatusText(
            userUUIDWithBrowserSuffix,
            "Active",
        );
    });
});
