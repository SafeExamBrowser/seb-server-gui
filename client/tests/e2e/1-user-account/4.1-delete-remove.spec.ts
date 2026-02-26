import { expect, test } from "@playwright/test";
import { addBrowserSuffixToText } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";
import { PlaywrightUserAccountsPage } from "../models/playwright-user-accounts-page";

const userLastName = "testdelete";
const userUUID = "seb-user-account-delete";

test.describe("1.4.1 User Accounts - DELETE Remove", () => {
    let userAccountsPage: PlaywrightUserAccountsPage;

    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        userAccountsPage = new PlaywrightUserAccountsPage(page);
        await userAccountsPage.goto();
        await userAccountsPage.expectVisible();
    });

    test("A Success", async (_, testInfo) => {
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

        //verify user delete icon is visible
        await expect(
            userAccountsPage.deleteIcon(userUUIDWithBrowserSuffix),
        ).toBeVisible();

        //click delete icon
        await userAccountsPage.clickDeleteIcon(userUUIDWithBrowserSuffix);

        //verify dialog shows
        await userAccountsPage.expectDeleteDialogVisible();

        //verify button says delete
        await expect(userAccountsPage.deleteConfirmButton).toHaveText("Delete");

        //click delete and assert network request
        await userAccountsPage.expectDeleteRequestSucceeded(
            userUUIDWithBrowserSuffix,
            async () => {
                await userAccountsPage.confirmDelete();
            },
        );
    });
});
