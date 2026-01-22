import { test, expect, Page } from "@playwright/test";
import {
    generateUniqueUsername,
    selectVuetifyFirstOption,
    selectVuetifyOptionByName,
} from "../utils/helpers";

// Setup Method for page
async function setupRegisterPage(page: Page) {
    await page.addInitScript(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    await page.goto("/register");
    await expect(page.getByTestId("register-page-container")).toBeVisible();

    const institutionSelect = page.getByTestId("register-institution-select");
    const username = page
        .getByTestId("register-username-input")
        .getByRole("textbox");
    const name = page.getByTestId("register-name-input").getByRole("textbox");
    const surname = page
        .getByTestId("register-surname-input")
        .getByRole("textbox");
    const email = page.getByTestId("register-email-input").getByRole("textbox");
    const timezoneSelect = page.getByTestId("register-timezone-select");
    const password = page
        .getByTestId("register-password-input")
        .getByRole("textbox");
    const confirmPassword = page
        .getByTestId("register-confirmPassword-input")
        .getByRole("textbox");

    const submitButton = page.getByTestId("register-submit-btn");
    const successAlert = page.getByTestId("register-success-alert");
    const errorAlert = page.getByTestId("register-error-alert");

    return {
        institutionSelect,
        username,
        name,
        surname,
        email,
        timezoneSelect,
        password,
        confirmPassword,
        submitButton,
        successAlert,
        errorAlert,
    };
}

//tests
test.describe("1.1.2 User Accounts - CREATE Register", () => {
    test("A Success", async ({ page }) => {
        const {
            institutionSelect,
            username,
            name,
            surname,
            email,
            timezoneSelect,
            password,
            confirmPassword,
            submitButton,
            successAlert,
        } = await setupRegisterPage(page);

        const uname = generateUniqueUsername("e2e-user");

        await selectVuetifyOptionByName(page, institutionSelect, "SEB Server");

        await username.fill(uname);
        await name.fill("John");
        await surname.fill("Doe");
        await email.fill(`${uname}@example.com`);

        await selectVuetifyFirstOption(page, timezoneSelect);
        await password.fill("StrongPass123!");
        await confirmPassword.fill("StrongPass123!");

        await submitButton.click();

        await successAlert.waitFor({ state: "attached", timeout: 10000 });
        await expect(successAlert).toBeVisible();
        await expect(page.getByTestId("register-error-alert")).toHaveCount(0);
    });

    test("B Failed validation (client-side form validation)", async ({
        page,
    }) => {
        const {
            username,
            name,
            surname,
            email,
            password,
            confirmPassword,
            submitButton,
        } = await setupRegisterPage(page);

        const uname = generateUniqueUsername("e2e-invalid");

        await username.fill(uname);
        await name.fill("Test");
        await surname.fill("User");
        await email.fill(`${uname}@example.com`);

        // too short (<8)
        await password.fill("Abc1");
        await confirmPassword.fill("Abc1");

        await submitButton.click();

        await expect(page.getByTestId("register-success-alert")).toHaveCount(0);
        await expect(page.getByTestId("register-error-alert")).toHaveCount(0);

        const anyValidationMessage = page.locator(
            ".v-messages .v-messages__message",
        );
        await expect(anyValidationMessage.first()).toBeVisible();
    });

    test("C Server error on register - username already exists", async ({
        page,
    }) => {
        const {
            institutionSelect,
            username,
            name,
            surname,
            email,
            timezoneSelect,
            password,
            confirmPassword,
            submitButton,
            successAlert,
            errorAlert,
        } = await setupRegisterPage(page);
        const uname = "createtests";

        await selectVuetifyOptionByName(page, institutionSelect, "SEB Server");

        await username.fill(uname);
        await name.fill("John");
        await surname.fill("Doe");
        await email.fill(`${uname}@example.com`);

        await selectVuetifyFirstOption(page, timezoneSelect);
        await password.fill("StrongPass123!");
        await confirmPassword.fill("StrongPass123!");

        await submitButton.click();

        await expect(errorAlert).toBeVisible();
        await expect(successAlert).toHaveCount(0);

        await expect(page).toHaveURL(/\/register(?:$|[?#])/i);
    });
});
