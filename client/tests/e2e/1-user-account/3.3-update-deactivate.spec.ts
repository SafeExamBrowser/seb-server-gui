import { expect, test } from "@playwright/test";
import { addBrowserSuffixToText } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";
import { PlaywrightUserAccountsPage } from "../models/playwright-user-accounts-page";

const userLastName = "testactive";
const userUUID = "seb-inst-admin-active";

test.describe("1.3.3 User Accounts - UPDATE Deactivate", () => {
    let userAccountsPage: PlaywrightUserAccountsPage;

    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        userAccountsPage = new PlaywrightUserAccountsPage(page);
        await userAccountsPage.goto();
        await userAccountsPage.expectVisible();
    });

    test("A Success", async ({ page }, testInfo) => {
        //generate brwoser specific values
        expect(page.url()).toContain("/user-accounts");

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
            "Active",
        );

        //click status
        await userAccountsPage.clickStatusChip(userUUIDWithBrowserSuffix);

        //verify dialog shows and button is correct
        await userAccountsPage.expectStatusDialogVisible();
        await expect(userAccountsPage.statusConfirmButton).toHaveText(
            "Deactivate",
        );
        //click DEACTIVATE and assert network request
        await userAccountsPage.expectDeactivateRequestSucceeded(
            userUUIDWithBrowserSuffix,
            async () => {
                await userAccountsPage.confirmStatusChange();
            },
        );

        await userAccountsPage.expectStatusText(
            userUUIDWithBrowserSuffix,
            "Inactive",
        );
    });
});
