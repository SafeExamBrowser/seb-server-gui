import { expect, Page } from "@playwright/test";

const SEB_SERVER_ADMIN_USERNAME = "testmain";
const SEB_SERVER_ADMIN_PASSWORD = "testmain";

export async function loginAsServerAdmin(
    page: Page,
    username: string = SEB_SERVER_ADMIN_USERNAME,
    password: string = SEB_SERVER_ADMIN_PASSWORD,
) {
    await page.goto("/");
    await expect(page.getByTestId("login-page-container")).toBeVisible();

    const usernameField = page.getByRole("textbox", { name: "Username *" });
    const passwordField = page.getByRole("textbox", { name: "Password *" });

    await usernameField.fill(username);
    await passwordField.fill(password);

    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/home(?:$|[?#])/i, {
        timeout: 10_000,
    });
}
