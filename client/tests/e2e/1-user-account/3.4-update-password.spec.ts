import { expect, test } from "@playwright/test";
import { loginAsServerAdmin } from "../utils/authenticate";
import { addBrowserSuffixToText } from "../utils/helpers";
import { PlaywrightUserAccountsPage } from "./models/playwright-user-accounts-page";
import { PlaywrightUserAccountPage } from "./models/playwright-user-account-page";

const userUUID = "seb-user-account-password";
const userLastName = "testpassword";

test.describe("1.3.4 User Accounts - UPDATE Password", () => {
    let userAccountsPage: PlaywrightUserAccountsPage;
    let userAccountPage: PlaywrightUserAccountPage;

    let userUUIDWithBrowserSuffix: string;
    let userLastNameWithBrowserSuffix: string;

    test.beforeEach(async ({ page }, testInfo) => {
        //log in
        await loginAsServerAdmin(page);

        // navigate to user accounts page
        userAccountsPage = new PlaywrightUserAccountsPage(page);
        await userAccountsPage.goto();
        await userAccountsPage.expectVisible();

        //update user to edit based on browser
        userUUIDWithBrowserSuffix = addBrowserSuffixToText(userUUID, testInfo);
        userLastNameWithBrowserSuffix = addBrowserSuffixToText(
            userLastName,
            testInfo,
        );

        //search and click edit icon on defined user
        await userAccountsPage.search(userLastNameWithBrowserSuffix);
        userAccountPage = await userAccountsPage.clickEditIcon(
            userUUIDWithBrowserSuffix,
        );

        //verify navigated
        await userAccountPage.expectVisible();
        await userAccountPage.expectStillOnEditPage(userUUIDWithBrowserSuffix);
    });

    test("A Success", async () => {
        // Open password dialog
        await userAccountPage.openChangePasswordDialog();

        // Fill dialog
        await userAccountPage.fillChangePasswordForm({
            adminPassword: "testmain",
            newPassword: "NewStrongPass123!",
            confirmNewPassword: "NewStrongPass123!",
        });

        // Expect request
        await userAccountPage.expectChangePasswordRequestSucceeded(async () => {
            await userAccountPage.submitChangePassword();
        });

        // Dialog gone
        await expect(userAccountPage.changePasswordDialog).toBeHidden();

        // Expect same page
        await userAccountPage.expectStillOnEditPage(userUUIDWithBrowserSuffix);
    });

    test("B Client Validation", async () => {
        const REQUIRED = "This field is required";
        const PASSWORD_TOO_SHORT = "Password must be at least 8 characters";
        const PASSWORDS_MUST_MATCH = "Passwords must match";

        await userAccountPage.openChangePasswordDialog();

        await expect(userAccountPage.changePasswordSaveButton).toBeDisabled();

        // required
        await userAccountPage.adminPassword.focus();
        await userAccountPage.newPassword.focus();
        await userAccountPage.confirmNewPassword.focus();
        await userAccountPage.changePasswordTitle.click();

        // Still disabled
        await expect(userAccountPage.changePasswordSaveButton).toBeDisabled();

        await userAccountPage.expectPasswordDialogFieldError(
            "editUserAccount-changePassword-adminPassword-input",
            REQUIRED,
        );
        await userAccountPage.expectPasswordDialogFieldError(
            "editUserAccount-changePassword-newPassword-input",
            REQUIRED,
        );
        await userAccountPage.expectPasswordDialogFieldError(
            "editUserAccount-changePassword-confirmNewPassword-input",
            REQUIRED,
        );

        //pwd too short
        await userAccountPage.fillChangePasswordForm({
            adminPassword: "testmain",
            newPassword: "Abc1",
            confirmNewPassword: "Abc1",
        });

        await userAccountPage.newPassword.focus();
        await userAccountPage.confirmNewPassword.focus();
        await userAccountPage.changePasswordTitle.click();

        await expect(userAccountPage.changePasswordSaveButton).toBeDisabled();

        await userAccountPage.expectPasswordDialogFieldError(
            "editUserAccount-changePassword-newPassword-input",
            PASSWORD_TOO_SHORT,
        );

        //passswords must match
        await userAccountPage.fillChangePasswordForm({
            adminPassword: "testmain",
            newPassword: "Abcdefg1",
            confirmNewPassword: "Abcdefg2",
        });

        await userAccountPage.confirmNewPassword.focus();
        await userAccountPage.changePasswordTitle.click();

        await expect(userAccountPage.changePasswordSaveButton).toBeDisabled();

        await userAccountPage.expectPasswordDialogFieldError(
            "editUserAccount-changePassword-confirmNewPassword-input",
            PASSWORDS_MUST_MATCH,
        );

        await expect(userAccountPage.changePasswordDialog).toBeVisible();
    });

    test("C Server Error - wrong admin password shows toast and keeps dialog open", async () => {
        await userAccountPage.openChangePasswordDialog();

        await userAccountPage.fillChangePasswordForm({
            adminPassword: "wrong-password",
            newPassword: "NewStrongPass123!",
            confirmNewPassword: "NewStrongPass123!",
        });

        const resp = await userAccountPage.captureChangePasswordResponse(
            async () => {
                await userAccountPage.submitChangePassword();
            },
        );

        expect(resp.status()).toBe(400);
        expect(resp.ok()).toBeFalsy();

        // toast pops up
        await userAccountPage.expectErrorToast([
            "Field validation error",
            "Password: wrong",
        ]);

        await userAccountPage.page.waitForTimeout(800);

        // dialog must NOT close, this test should fail here
        await expect(userAccountPage.changePasswordDialog).toBeVisible();

        // still on same edit page
        await userAccountPage.expectStillOnEditPage(userUUIDWithBrowserSuffix);
    });
});
