import { test } from "@playwright/test";
import { clearLocalAndSessionStorage, navigateTo } from "../utils/helpers";
import { PlaywrightLoginPage } from "../models/playwright-login-page";

const correctUser = "testmain";
const correctPass = "testmain";
const wrongUser = "invalid@example.cdasdpef_#!@#!DFFADFA||>>:P";
const wrongPass = "wrong-passworddddddddddddddd";

// this triggers video recording for the worker
test.use({
    video: { mode: "on" },
});

test.describe("1.2.1 User Accounts - READ Log in", () => {
    test.beforeEach(async ({ page }) => {
        await clearLocalAndSessionStorage(page);
        await navigateTo(page, "");
    });

    test("A Successful login", async ({ page }) => {
        const loginPage = new PlaywrightLoginPage(page);

        await loginPage.expectVisible();
        await loginPage.login(correctUser, correctPass);

        await loginPage.expectRedirectToHome();
    });

    test("B Failed login, bad credentials", async ({ page }) => {
        const loginPage = new PlaywrightLoginPage(page);

        await loginPage.expectVisible();
        await loginPage.login(wrongUser, wrongPass);

        await loginPage.expectErrorVisible();

        await loginPage.expectNoRedirect();

        await page.waitForTimeout(600);
    });
});
