import { expect, type Locator, type Page } from "@playwright/test";
import {
    expectToHaveUrl,
    selectVuetifyFirstOption,
    selectVuetifyOptionByName,
} from "../utils/helpers";

export class PlaywrightRegisterPage {
    readonly page: Page;

    // Page identity
    readonly container: Locator;

    // Fields
    readonly institutionSelect: Locator;
    readonly username: Locator;
    readonly name: Locator;
    readonly surname: Locator;
    readonly email: Locator;
    readonly timezoneSelect: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;

    // Actions
    readonly submitButton: Locator;

    // Feedback
    readonly successAlert: Locator;
    readonly errorAlert: Locator;

    // Optional: Vuetify validation messages
    readonly validationMessages: Locator;

    constructor(page: Page) {
        this.page = page;

        // Page identity
        this.container = page.getByTestId("register-page-container");

        // Fields
        this.institutionSelect = page.getByTestId(
            "register-institution-select",
        );

        this.username = page
            .getByTestId("register-username-input")
            .getByRole("textbox");

        this.name = page
            .getByTestId("register-name-input")
            .getByRole("textbox");

        this.surname = page
            .getByTestId("register-surname-input")
            .getByRole("textbox");

        this.email = page
            .getByTestId("register-email-input")
            .getByRole("textbox");

        this.timezoneSelect = page.getByTestId("register-timezone-select");

        this.password = page
            .getByTestId("register-password-input")
            .getByRole("textbox");

        this.confirmPassword = page
            .getByTestId("register-confirmPassword-input")
            .getByRole("textbox");

        // Actions
        this.submitButton = page.getByTestId("register-submit-btn");

        // Feedback
        this.successAlert = page.getByTestId("register-success-alert");
        this.errorAlert = page.getByTestId("register-error-alert");

        this.validationMessages = page.locator(
            ".v-messages .v-messages__message",
        );
    }

    // ------------------------
    // Navigation / State
    // ------------------------

    async goto() {
        await this.page.goto("/register");
        await this.expectVisible();
    }

    async expectVisible() {
        await expect(this.container).toBeVisible();
    }

    async expectSuccessVisible() {
        await this.successAlert.waitFor({ state: "attached", timeout: 10_000 });
        await expect(this.successAlert).toBeVisible();
    }

    async expectErrorVisible() {
        await this.errorAlert.waitFor({ state: "attached", timeout: 10_000 });
        await expect(this.errorAlert).toBeVisible();
    }

    async expectSuccessNotVisible() {
        await expect(this.successAlert).toHaveCount(0);
    }

    async expectErrorNotVisible() {
        await expect(this.errorAlert).toHaveCount(0);
    }

    // ------------------------
    // Redirect Assertions
    // ------------------------

    async expectRedirectToLogin() {
        await expectToHaveUrl(this.page, "");
    }

    async expectNoRedirect() {
        await expectToHaveUrl(this.page, "register");
    }

    // ------------------------
    // Atomic Actions
    // ------------------------

    async selectInstitutionByName(name: string) {
        await selectVuetifyOptionByName(
            this.page,
            this.institutionSelect,
            name,
        );
    }

    async selectFirstTimezoneOption() {
        await selectVuetifyFirstOption(this.page, this.timezoneSelect);
    }

    async fillUsername(value: string) {
        await this.username.fill(value);
    }

    async fillName(value: string) {
        await this.name.fill(value);
    }

    async fillSurname(value: string) {
        await this.surname.fill(value);
    }

    async fillEmail(value: string) {
        await this.email.fill(value);
    }

    async fillPassword(value: string) {
        await this.password.fill(value);
    }

    async fillConfirmPassword(value: string) {
        await this.confirmPassword.fill(value);
    }

    async submit() {
        await this.submitButton.click();
    }

    // ------------------------
    // Convenience Flow
    // ------------------------

    async register(params: {
        institutionName?: string;
        username: string;
        name: string;
        surname: string;
        email?: string;
        pickFirstTimezone?: boolean;
        password: string;
        confirmPassword: string;
    }) {
        if (params.institutionName) {
            await this.selectInstitutionByName(params.institutionName);
        }

        await this.fillUsername(params.username);
        await this.fillName(params.name);
        await this.fillSurname(params.surname);
        await this.fillEmail(params.email);

        if (params.pickFirstTimezone) {
            await this.selectFirstTimezoneOption();
        }

        await this.fillPassword(params.password);
        await this.fillConfirmPassword(params.confirmPassword);

        await this.submit();
    }

    async expectAnyValidationMessageVisible() {
        await expect(this.validationMessages.first()).toBeVisible();
    }
}
