import { expect, type Locator, type Page } from "@playwright/test";

// The top-right current-user chip lives in the app shell, so it is reusable
// across every authenticated domain. It reads the current user (GET /useraccount/me)
// and renders initials, full name, primary role label, and a menu with the
// username, role chips, the profile-settings shortcut and logout.
export class ProfileMenuModel {
    readonly page: Page;
    readonly button: Locator;
    readonly menu: Locator;
    readonly username: Locator;
    readonly roles: Locator;
    readonly profileSettingsAction: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.button = page.getByTestId("layout-profile-button");
        this.menu = page.getByTestId("layout-profile-menu");
        this.username = page.getByTestId("layout-profile-username");
        this.roles = page.getByTestId("layout-profile-roles");
        this.profileSettingsAction = page.getByTestId(
            "layout-profile-action-profile-settings",
        );
        this.logoutButton = page.getByTestId("layout-profile-logout");
    }

    async expectChipShows(fullName: string, primaryRoleLabel: string) {
        await expect(this.button).toContainText(fullName);
        await expect(this.button).toContainText(primaryRoleLabel);
    }

    async open() {
        await this.button.click();
        await expect(this.menu).toBeVisible();
    }

    async expectRole(roleLabel: string) {
        await expect(this.roles).toContainText(roleLabel);
    }

    async gotoProfileSettings() {
        await this.profileSettingsAction.click();
    }

    async logout() {
        await this.logoutButton.click();
    }
}
