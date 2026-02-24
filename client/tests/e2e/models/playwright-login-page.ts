import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightLoginPage {
    readonly page: Page;

    // Page identity
    readonly container: Locator;

    // Fields
    readonly username: Locator;
    readonly password: Locator;

    // Feedback
    readonly errorAlert: Locator;

    // Constructor
    constructor(page: Page) {
        this.page = page;

        // Page container
        this.container = page.getByTestId("login-page-container");

        // Fields
        this.username = page.getByRole("textbox", { name: "Username *" });
        this.password = page.getByRole("textbox", { name: "Password *" });

        // Error feedback
        this.errorAlert = page.getByTestId("login-error-alert");
    }

    // ------------------------
    // Navigation / State
    // ------------------------

    async goto() {
        await this.page.goto("/");
        await this.expectVisible();
    }

    async expectVisible() {
        await expect(this.container).toBeVisible();
    }

    async expectErrorVisible() {
        await this.errorAlert.waitFor({ state: "attached", timeout: 10_000 });
        await expect(this.errorAlert).toBeVisible();
    }

    async expectErrorNotVisible() {
        await expect(this.errorAlert).toHaveCount(0);
    }

    // ------------------------
    // Atomic Actions
    // ------------------------

    async fillUsername(value: string) {
        await this.username.fill(value);
    }

    async fillPassword(value: string) {
        await this.password.fill(value);
    }

    async submit() {
        await this.page.keyboard.press("Enter");
    }

    async clearFields() {
        await this.username.clear();
        await this.password.clear();
    }

    // ------------------------
    // Convenience Flow
    // ------------------------

    async login(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.submit();
    }
}
