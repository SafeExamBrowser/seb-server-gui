import { test, expect, Page, Locator } from "@playwright/test";

// create an unique username based on current datetime -> So that there is absolutely no way this test fails because of a duplicate username
// todo, maybe extreact into a separate method to add current date time to whatever variable
function uniqueUsername(prefix = "e2e") {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const ts = [
        d.getUTCFullYear(),
        pad(d.getUTCMonth() + 1),
        pad(d.getUTCDate()),
        "-",
        pad(d.getUTCHours()),
        pad(d.getUTCMinutes()),
        pad(d.getUTCSeconds()),
        "-",
        d.getUTCMilliseconds(),
    ].join("");
    return `${prefix}-${ts}`;
}

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

// select option by text from selector (for institution)
async function selectVuetifyOptionByName(
    page: Page,
    selectRoot: Locator,
    optionName: string,
) {
    const input = selectRoot.locator(".v-field__input").first();
    await input.click();

    const option = page.getByRole("option", { name: optionName });
    await option.click();

    await page.keyboard.press("Escape").catch(() => {});
}

// select first option from selector (for timezone)
// todo Consider exporting to utils file
async function selectVuetifyFirstOption(page: Page, selectRoot: Locator) {
    const input = selectRoot.locator(".v-field__input").first();
    await input.click();

    await expect(page.getByRole("option").first()).toBeVisible({
        timeout: 10000,
    });

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Escape").catch(() => {});
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

        const uname = uniqueUsername("e2e-user");

        await selectVuetifyOptionByName(page, institutionSelect, "SEB Server");

        await username.fill(uname);
        await name.fill("Andrei");
        await surname.fill("Mititelu");
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

        const uname = uniqueUsername("e2e-invalid");

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

    //createtests as username
    test("C Server error on register (simulated)", async ({ page }) => {
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
        await name.fill("Andrei");
        await surname.fill("Mititelu");
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
