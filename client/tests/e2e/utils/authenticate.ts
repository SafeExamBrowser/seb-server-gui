import { Page } from "@playwright/test";
import { expectToHaveUrl } from "./helpers";
import { LoginPageModel } from "../shared/page-models/layout/login-page.model";

const SEB_SERVER_ADMIN_USERNAME = "testmain";
const SEB_SERVER_ADMIN_PASSWORD = "testmain";

export async function loginAsServerAdmin(
    page: Page,
    username: string = SEB_SERVER_ADMIN_USERNAME,
    password: string = SEB_SERVER_ADMIN_PASSWORD,
) {
    const loginPage = new LoginPageModel(page);
    await loginPage.goto();
    await loginPage.login(username, password);

    await expectToHaveUrl(page, "navigation-overview");
}
