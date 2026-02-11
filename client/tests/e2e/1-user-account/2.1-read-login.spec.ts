import { test, expect, Page } from "@playwright/test";
import { loginAsServerAdmin } from "../utils/authenticate";
import { clearLocalAndSessionStorage, navigateTo } from "../utils/helpers";

const correctUser = "testmain";
const correctPass = "testmain";
const wrongUser = "invalid@example.cdasdpef_#!@#!DFFADFA||>>:P";
const wrongPass = "wrong-passworddddddddddddddd";

async function setupLoginPage(page: Page) {
    await expect(page.getByTestId("login-page-container")).toBeVisible();
    //fields definition
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
    test.beforeEach(async ({ page }) => {
        await clearLocalAndSessionStorage(page);
        await navigateTo(page, "/");
    });

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
});
