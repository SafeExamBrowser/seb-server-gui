import {
    expect,
    type Locator,
    type Page,
    type Response,
} from "@playwright/test";
import {
    selectVuetifyFirstOption,
    selectVuetifyOptionByName,
} from "../utils/helpers";
import {
    expectNoRequest,
    expectRequestSucceeded,
    waitForResponse,
} from "../utils/networkAssertions";

export class PlaywrightCreateUserAccountPage {
    readonly page: Page;

    // ------------------------
    // Page identity / layout
    // ------------
    readonly container: Locator;

    // Selects
    readonly institutionSelect: Locator;
    readonly roleSelect: Locator;
    readonly timezoneSelect: Locator;

    // Fields
    readonly username: Locator;
    readonly name: Locator;
    readonly surname: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly confirmPassword: Locator;

    // Buttons
    readonly saveButton: Locator;
    readonly cancelButton: Locator;

    // Toasts
    readonly toast: Locator;
    readonly toastText: Locator;

    private readonly userAccountUrlRegex = /\/useraccount(?:\?|$)/i;

    constructor(page: Page) {
        this.page = page;

        // identity
        this.container = page.getByTestId("createUserAccount-form-container");

        // selects
        this.institutionSelect = page.getByTestId(
            "createUserAccount-institution-select",
        );
        this.roleSelect = page.getByTestId("createUserAccount-role-select");
        this.timezoneSelect = page.getByTestId(
            "createUserAccount-timezone-select",
        );

        // fields
        this.username = page
            .getByTestId("createUserAccount-username-input")
            .getByRole("textbox");
        this.name = page
            .getByTestId("createUserAccount-name-input")
            .getByRole("textbox");
        this.surname = page
            .getByTestId("createUserAccount-surname-input")
            .getByRole("textbox");
        this.email = page
            .getByTestId("createUserAccount-email-input")
            .getByRole("textbox");
        this.password = page
            .getByTestId("createUserAccount-password-input")
            .getByRole("textbox");
        this.confirmPassword = page
            .getByTestId("createUserAccount-confirmPassword-input")
            .getByRole("textbox");

        // buttons
        this.saveButton = page.getByTestId("createUserAccount-save-button");
        this.cancelButton = page.getByTestId("createUserAccount-cancel-button");

        // toasts
        this.toast = page.locator(".toast-item[role='alert']");
        this.toastText = this.toast.locator(".toast-text");
    }

    // ------------------------
    // Navigation / State
    // ------------------------

    async expectVisible() {
        await expect(this.container).toBeVisible();
    }

    async expectRedirectToUserAccounts() {
        await expect(this.page).toHaveURL(/\/user-accounts(?:$|[?#])/i, {
            timeout: 10_000,
        });
    }

    async expectStillOnCreatePage() {
        await expect(this.page).toHaveURL(
            /\/user-accounts\/create(?:$|[?#])/i,
            { timeout: 10_000 },
        );
    }

    // ------------------------
    // Select helpers
    // ------------------------
    async selectInstitution(name: string) {
        await selectVuetifyOptionByName(
            this.page,
            this.institutionSelect,
            name,
        );
    }

    async selectRole(name: string) {
        await selectVuetifyOptionByName(this.page, this.roleSelect, name);
    }

    async selectTimezone(name: string) {
        await selectVuetifyOptionByName(this.page, this.timezoneSelect, name);
    }

    async pickFirstTimezone() {
        await selectVuetifyFirstOption(this.page, this.timezoneSelect);
    }

    // ------------------------
    // Field helpers
    // ------------------------
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
        await this.saveButton.click();
    }

    // ------------------------
    // Convenience Form FIller
    // ------------------------
    async fillForm(params: {
        institutionName?: string;
        roleName?: string;
        timezoneName?: string;
        pickFirstTimezone?: boolean;
        username: string;
        name: string;
        surname: string;
        email?: string;
        password: string;
        confirmPassword: string;
    }) {
        if (params.institutionName)
            await this.selectInstitution(params.institutionName);
        if (params.roleName) await this.selectRole(params.roleName);

        if (params.timezoneName) await this.selectTimezone(params.timezoneName);
        if (params.pickFirstTimezone) await this.pickFirstTimezone();

        await this.fillUsername(params.username);
        await this.fillName(params.name);
        await this.fillSurname(params.surname);

        if (params.email !== undefined) await this.fillEmail(params.email);

        await this.fillPassword(params.password);
        await this.fillConfirmPassword(params.confirmPassword);
    }

    // ------------------------
    // Validation assertions
    // ------------------------
    private fieldError(testId: string, text: string) {
        const field = this.page.getByTestId(testId);
        return field.locator(".v-messages__message").filter({ hasText: text });
    }

    async expectFieldError(testId: string, text: string) {
        await expect(this.fieldError(testId, text)).toHaveCount(1, {
            timeout: 5000,
        });
    }

    async expectRequiredFieldErrors(errors: {
        institution?: string;
        username?: string;
        name?: string;
        surname?: string;
        password?: string;
        confirmPassword?: string;
        role?: string;
    }) {
        if (errors.institution)
            await this.expectFieldError(
                "createUserAccount-institution-select",
                errors.institution,
            );

        if (errors.username)
            await this.expectFieldError(
                "createUserAccount-username-input",
                errors.username,
            );

        if (errors.name)
            await this.expectFieldError(
                "createUserAccount-name-input",
                errors.name,
            );

        if (errors.surname)
            await this.expectFieldError(
                "createUserAccount-surname-input",
                errors.surname,
            );

        if (errors.password)
            await this.expectFieldError(
                "createUserAccount-password-input",
                errors.password,
            );

        if (errors.confirmPassword)
            await this.expectFieldError(
                "createUserAccount-confirmPassword-input",
                errors.confirmPassword,
            );

        if (errors.role)
            await this.expectFieldError(
                "createUserAccount-role-select",
                errors.role,
            );
    }

    async expectPasswordTooShort(text: string) {
        await this.expectFieldError("createUserAccount-password-input", text);
    }

    async expectPasswordsMustMatch(text: string) {
        await this.expectFieldError(
            "createUserAccount-confirmPassword-input",
            text,
        );
    }

    // ------------------------
    // Toast assertions
    // ------------------------
    async expectErrorToast(contains: string[]) {
        await expect(this.toast).toBeVisible();
        for (const part of contains) {
            await expect(this.toastText).toContainText(part);
        }
    }

    // ------------------------
    // Network helpers
    // ------------------------
    async expectCreateRequestSucceeded(action: () => Promise<void>) {
        await expectRequestSucceeded({
            page: this.page,
            method: "POST",
            urlRegex: this.userAccountUrlRegex,
            action,
            expectedStatus: 200,
        });
    }

    async captureCreateResponse(
        action: () => Promise<void>,
    ): Promise<Response> {
        const respPromise = waitForResponse(
            this.page,
            "POST",
            this.userAccountUrlRegex,
        );

        await action();
        return await respPromise;
    }

    async expectNoCreateRequest(action: () => Promise<void>) {
        await expectNoRequest({
            page: this.page,
            method: "POST",
            urlRegex: this.userAccountUrlRegex,
            action,
            settleMs: 300,
        });
    }
}
