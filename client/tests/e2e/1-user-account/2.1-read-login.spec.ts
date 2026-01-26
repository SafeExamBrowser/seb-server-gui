import { test, expect, Page } from "@playwright/test";
import { loginAsServerAdmin } from "../utils/authenticate";

const correctUser = "testmain";
const correctPass = "testmain";
const wrongUser = "invalid@example.cdasdpef";
const wrongPass = "wrong-passworddddddddddddddd";

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

//this triggers video recording for the worker
test.use({
    video: {
        mode: "on",
    },
});

test.describe("1.2.1 User Accounts - READ Log in", () => {
    test("A Successful login", async ({ page }) => {
        await loginAsServerAdmin(page, correctUser, correctPass);
    });

    test("B Failed login, bad credentials", async ({ page }) => {
        const { username, password } = await setupLoginPage(page);

        await username.fill(wrongUser);
        await password.fill(wrongPass);
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
