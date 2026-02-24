import { Page } from "@playwright/test";
import { expectToHaveUrl } from "./helpers";
import { PlaywrightLoginPage } from "../models/playwright-login-page";

const SEB_SERVER_ADMIN_USERNAME = "testmain";
const SEB_SERVER_ADMIN_PASSWORD = "testmain";

export async function loginAsServerAdmin(
    page: Page,
    username: string = SEB_SERVER_ADMIN_USERNAME,
    password: string = SEB_SERVER_ADMIN_PASSWORD,
) {
    const loginPage = new PlaywrightLoginPage(page);
    await loginPage.goto();
    await loginPage.expectVisible();
    await loginPage.login(username, password);

    await expectToHaveUrl(page, "home");
}
