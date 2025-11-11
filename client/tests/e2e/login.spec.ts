import { test, expect, Page } from "@playwright/test";

const USER = process.env.E2E_USER || "playwright";
const PASS = process.env.E2E_PASS || "playwright";

async function setupLoginPage(page: Page) {
    await page.addInitScript(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    await page.goto("/");
    await expect(page.getByTestId("login-page-container")).toBeVisible();

    const username = page
        .getByTestId("login-username-input")
        .getByRole("textbox");
    const password = page
        .getByTestId("login-password-input")
        .getByRole("textbox");

    return { username, password };
}

test.describe("LoginPage", () => {
    test("logs in with Enter and redirects to /home", async ({ page }) => {
        const { username, password } = await setupLoginPage(page);

        await username.fill(USER);
        await password.fill(PASS);
        await page.keyboard.press("Enter");

        await expect(page).toHaveURL(/\/home(?:$|[?#])/i, { timeout: 5000 });
    });

    test("shows error on invalid credentials", async ({ page }) => {
        const { username, password } = await setupLoginPage(page);

        await username.fill("invalid@example.com");
        await password.fill("wrong-password");
        await page.keyboard.press("Enter");

        const alert = page.getByTestId("login-error-alert");
        await alert.waitFor({ state: "attached", timeout: 10000 });
        await expect(alert).toHaveCount(1);
        await page.waitForTimeout(600);
    });

    test("register link navigates on click and Space/Enter", async ({
        page,
    }) => {
        await page.goto("/");

        const link = page.getByTestId("login-register-link");

        await link.click();
        await expect(page).toHaveURL(/register/);

        await page.goto("/");
        await link.focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(/register/);

        await page.goto("/");
        await link.focus();
        await page.keyboard.press(" ");
        await expect(page).toHaveURL(/register/);
    });
});
