import { test, expect, Page } from "@playwright/test";

const USER = "playwright";
const PASS = "playwright";

async function setupLoginPage(page: Page) {
    await page.addInitScript(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    await page.goto("/");
    await expect(page.getByTestId("login-page-container")).toBeVisible();

    const username = page.getByRole("textbox", { name: "Username *" });
    const password = page.getByRole("textbox", { name: "Password *" });

    return { username, password };
}

test.describe("1.2.1 User Accounts - READ Log in", () => {
    test("A Successful login", async ({ page }) => {
        const { username, password } = await setupLoginPage(page);

        await username.fill(USER);
        await password.fill(PASS);
        await page.keyboard.press("Enter");

        await expect(page).toHaveURL(/\/home(?:$|[?#])/i, { timeout: 5000 });
    });

    test("B Failed login, bad credentials", async ({ page }) => {
        const { username, password } = await setupLoginPage(page);

        await username.fill("invalid@example.com");
        await password.fill("wrong-password");
        await page.keyboard.press("Enter");

        const alert = page.getByTestId("login-error-alert");
        await alert.waitFor({ state: "attached", timeout: 10000 });
        await expect(alert).toHaveCount(1);
        await page.waitForTimeout(600);
    });

    test("C Navigates to Register", async ({ page }) => {
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
