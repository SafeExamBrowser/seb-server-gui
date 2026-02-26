import { test } from "@playwright/test";
import { PlaywrightLoginPage } from "../models/playwright-login-page";
import { clearLocalAndSessionStorage } from "../utils/helpers";
import type { PlaywrightRegisterPage } from "../models/playwright-register-page";
import { generateUniqueUsername } from "../utils/helpers";

test.describe("1.1.2 User Accounts - CREATE Register", () => {
    let registerPage: PlaywrightRegisterPage;

    test.beforeEach(async ({ page }) => {
        await clearLocalAndSessionStorage(page);
        const loginPage = new PlaywrightLoginPage(page);
        await loginPage.goto();
        registerPage = await loginPage.navigateToRegister();
    });

    test("A Success", async () => {
        const uname = generateUniqueUsername("e2e-user");

        await registerPage.register({
            institutionName: "SEB Server",
            username: uname,
            name: "John",
            surname: "Doe",
            email: `${uname}@example.com`,
            pickFirstTimezone: true,
            password: "StrongPass123!",
            confirmPassword: "StrongPass123!",
        });

        await registerPage.expectSuccessVisible();
        await registerPage.expectErrorNotVisible();
        await registerPage.expectRedirectToLogin();
    });

    test("B Failed validation (client-side form validation)", async () => {
        const uname = generateUniqueUsername("e2e-invalid");

        await registerPage.register({
            username: "",
            name: "",
            surname: "",
            email: `${uname}@example.com`,
            pickFirstTimezone: false,
            password: "Abc1",
            confirmPassword: "Abc1",
        });

        await registerPage.expectSuccessNotVisible();
        await registerPage.expectErrorNotVisible();
        await registerPage.expectAnyValidationMessageVisible();
        await registerPage.expectNoRedirect();
    });

    test("C Server error on register - username already exists", async () => {
        const uname = "createtests";

        await registerPage.register({
            institutionName: "SEB Server",
            username: uname,
            name: "John",
            surname: "Doe",
            email: `${uname}@example.com`,
            pickFirstTimezone: true,
            password: "StrongPass123!",
            confirmPassword: "StrongPass123!",
        });

        await registerPage.expectErrorVisible();
        await registerPage.expectSuccessNotVisible();
        await registerPage.expectNoRedirect();
    });
});
