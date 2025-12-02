import { test, expect, Page } from "@playwright/test";

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

    return {
        institutionSelect,
        username,
        name,
        surname,
        email,
        timezoneSelect,
        password,
        confirmPassword,
    };
}

async function pickFirstOptionFromVuetifySelect(
    page: Page,
    selectLocator: ReturnType<Page["locator"]>,
) {
    await selectLocator.click();
    const option = page
        .locator(
            ".v-overlay-container .v-list-item, .v-overlay-container [role='option']",
        )
        .first();
    await option.click();
}

test.describe("RegisterPage", () => {
    test("successfully registers (unique username) and shows success alert", async ({
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
        } = await setupRegisterPage(page);

        const uname = uniqueUsername("e2e-user");
        await username.fill(uname);
        await name.fill("Andrei");
        await surname.fill("Mititelu");
        await email.fill(`${uname}@example.com`);

        await pickFirstOptionFromVuetifySelect(page, institutionSelect);
        await pickFirstOptionFromVuetifySelect(page, timezoneSelect);

        await password.fill("StrongPass123!");
        await confirmPassword.fill("StrongPass123!");

        await page.getByTestId("register-submit-btn").click();

        const successAlert = page.getByTestId("register-success-alert");
        await successAlert.waitFor({ state: "attached", timeout: 10000 });
        await expect(successAlert).toBeVisible();

        await expect(page.getByTestId("register-error-alert")).toHaveCount(0);
    });

    test("fails client-side validation (no institution/timezone + short password)", async ({
        page,
    }) => {
        const { username, name, surname, email, password, confirmPassword } =
            await setupRegisterPage(page);

        const uname = uniqueUsername("e2e-invalid");
        await username.fill(uname);
        await name.fill("Test");
        await surname.fill("User");
        await email.fill(`${uname}@example.com`);

        await password.fill("Abc1"); // < 8 chars
        await confirmPassword.fill("Abc1");

        await page.getByTestId("register-submit-btn").click();

        await expect(page.getByTestId("register-success-alert")).toHaveCount(0);
        await expect(page.getByTestId("register-error-alert")).toHaveCount(0);

        const anyValidationMessage = page.locator(
            ".v-messages .v-messages__message",
        );
        await expect(anyValidationMessage.first()).toBeVisible();
    });

    test("login link navigates to / on click and Space/Enter", async ({
        page,
    }) => {
        await page.goto("/register");

        const loginLink = page.getByTestId("register-login-link");
        await expect(loginLink).toBeVisible();

        await loginLink.click();
        await expect(page).toHaveURL(/\/(?:$|[?#])/);

        await page.goto("/register");
        await loginLink.focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(/\/(?:$|[?#])/);

        await page.goto("/register");
        await loginLink.focus();
        await page.keyboard.press(" ");
        await expect(page).toHaveURL(/\/(?:$|[?#])/);
    });
});
