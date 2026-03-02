import { expect, test } from "@playwright/test";
import { loginAsServerAdmin } from "../utils/authenticate";
import { generateUniqueUsername } from "../utils/helpers";
import { PlaywrightCreateUserAccountPage } from "../models/playwright-create-user-account-page";
import { PlaywrightUserAccountsPage } from "../models/playwright-user-accounts-page";

test.describe("1.1 User Accounts - CREATE Add", () => {
    let createUserAccountPage: PlaywrightCreateUserAccountPage;

    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);

        // go to user accounts
        const userAccountsPage = new PlaywrightUserAccountsPage(page);
        await userAccountsPage.goto();
        await userAccountsPage.expectVisible();

        //this navigates to create user account and returns the CreateUserAccountPagePOM
        createUserAccountPage =
            await userAccountsPage.navigateToCreateUserAccount();
        await createUserAccountPage.expectVisible();
    });

    test("A Success - creates a new INACTIVE user account", async ({
        page,
    }) => {
        expect(page.url()).toContain("/user-accounts/create");

        //generate an unique value
        const uniqueValue = generateUniqueUsername("e2e-1.1.A-Success");

        await createUserAccountPage.fillForm({
            institutionName: "SEB Server",
            roleName: "Server Administrator",
            username: `${uniqueValue}Username`,
            name: `${uniqueValue}Name`,
            surname: `${uniqueValue}LastName`,
            email: `${uniqueValue}@email.com`,
            pickFirstTimezone: true,
            password: "StrongPass123!",
            confirmPassword: "StrongPass123!",
        });

        await createUserAccountPage.expectCreateRequestSucceeded(async () => {
            await createUserAccountPage.submit();
        });

        await createUserAccountPage.expectRedirectToUserAccounts();
    });

    test("B Client Validation - shows validation messages and does NOT call create API", async ({
        page,
    }) => {
        expect(page.url()).toContain("/user-accounts/create");

        const REQUIRED = "This field is required";
        const PASSWORD_TOO_SHORT = "Password must be at least 8 characters";
        const PASSWORDS_MUST_MATCH = "Passwords must match";

        await createUserAccountPage.expectNoCreateRequest(async () => {
            await createUserAccountPage.submit();
        });

        await createUserAccountPage.expectRequiredFieldErrors({
            institution: REQUIRED,
            username: REQUIRED,
            name: REQUIRED,
            surname: REQUIRED,
            password: REQUIRED,
            confirmPassword: REQUIRED,
            role: REQUIRED,
        });

        await createUserAccountPage.fillPassword("Abc1");
        await createUserAccountPage.expectNoCreateRequest(async () => {
            await createUserAccountPage.submit();
        });
        await createUserAccountPage.expectPasswordTooShort(PASSWORD_TOO_SHORT);

        await createUserAccountPage.fillPassword("Abcdefg1");
        await createUserAccountPage.fillConfirmPassword("Abcdefg2");
        await createUserAccountPage.expectNoCreateRequest(async () => {
            await createUserAccountPage.submit();
        });
        await createUserAccountPage.expectPasswordsMustMatch(
            PASSWORDS_MUST_MATCH,
        );

        await createUserAccountPage.expectStillOnCreatePage();
    });

    test("C Server Error - duplicate username shows toast", async ({
        page,
    }) => {
        expect(page.url()).toContain("/user-accounts/create");

        const uniqueValue = generateUniqueUsername("e2e-1.1.C-Server-Error");

        await createUserAccountPage.fillForm({
            institutionName: "SEB Server",
            roleName: "Server Administrator",
            username: "createtests", //there should be a db entry with username createtests
            name: `${uniqueValue}Name`,
            surname: `${uniqueValue}LastName`,
            email: `${uniqueValue}@email.com`,
            password: "StrongPass123!",
            confirmPassword: "StrongPass123!",
        });

        const resp = await createUserAccountPage.captureCreateResponse(
            async () => {
                await createUserAccountPage.submit();
            },
        );

        expect(resp.status()).toBe(400);
        expect(resp.ok()).toBeFalsy();

        await createUserAccountPage.expectStillOnCreatePage();
        await createUserAccountPage.expectErrorToast([
            "Field validation error",
            "Username is already being used.",
        ]);
    });
});
