import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPageModel {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly signInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page
            .getByTestId("login-username-input")
            .getByRole("textbox");
        this.password = page
            .getByTestId("login-password-input")
            .getByRole("textbox");
        this.signInButton = page.getByTestId("login-signin-btn");
    }

    async goto() {
        await this.page.goto("/");
        await this.expectVisible();
    }

    async expectVisible() {
        await expect(this.signInButton).toBeVisible();
    }

    async login(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.signInButton.click();
    }
}
