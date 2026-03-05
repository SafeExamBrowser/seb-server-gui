import {
    expect,
    type Locator,
    type Page,
    type Response,
} from "@playwright/test";
import {
    selectVuetifyFirstOption,
    selectVuetifyOptionByName,
} from "../../utils/helpers";
import {
    expectNoRequest,
    expectRequestSucceeded,
    waitForResponse,
} from "../../utils/networkAssertions";

export class PlaywrightUserAccountPage {
    readonly page: Page;

    // ------------------------
    // Page identity / layout
    // ------------------------
    readonly container: Locator;

    // Header / status
    readonly headerRow: Locator;
    readonly title: Locator;
    readonly statusChip: Locator;
    readonly createdAtText: Locator;

    // Selects
    readonly institutionSelect: Locator;
    readonly roleSelect: Locator;
    readonly timezoneSelect: Locator;

    // Fields
    readonly username: Locator;
    readonly name: Locator;
    readonly surname: Locator;
    readonly email: Locator;

    // Password field
    readonly passwordChangeOpen: Locator;
    readonly passwordField: Locator;

    // Buttons
    readonly saveChangesButton: Locator;
    readonly backButton: Locator;

    // Dialog: Change password
    readonly changePasswordDialog: Locator;
    readonly changePasswordTitle: Locator;
    readonly adminPassword: Locator;
    readonly newPassword: Locator;
    readonly confirmNewPassword: Locator;
    readonly changePasswordCancelButton: Locator;
    readonly changePasswordSaveButton: Locator;

    // Toasts
    readonly toast: Locator;
    readonly toastText: Locator;

    // --- Network URL regexes ---
    private readonly userAccountUrlRegex = /\/useraccount(?:\/|$|\?)/i;
    private readonly userAccountPasswordUrlRegex =
        /\/useraccount\/password(?:\/|$|\?)/i;

    constructor(page: Page) {
        this.page = page;

        // identity
        this.container = page.getByTestId("editUserAccount-form-container");

        // header / info
        this.headerRow = page.getByTestId("editUserAccount-header-row");
        this.title = page.getByTestId("editUserAccount-form-title");
        this.statusChip = page.getByTestId("editUserAccount-status-chip");
        this.createdAtText = page.getByTestId("editUserAccount-createdAt-text");

        // selects
        this.institutionSelect = page.getByTestId(
            "editUserAccount-institution-select",
        );
        this.roleSelect = page.getByTestId("createUserAccount-role-select");
        this.timezoneSelect = page.getByTestId(
            "editUserAccount-timezone-select",
        );

        // fields (Vuetify v-text-field => textbox role)
        this.username = page
            .getByTestId("editUserAccount-username-input")
            .getByRole("textbox");
        this.name = page
            .getByTestId("editUserAccount-name-input")
            .getByRole("textbox");
        this.surname = page
            .getByTestId("editUserAccount-surname-input")
            .getByRole("textbox");
        this.email = page
            .getByTestId("editUserAccount-email-input")
            .getByRole("textbox");

        // password open / field
        this.passwordChangeOpen = page.getByTestId(
            "editUserAccount-passwordChange-open",
        );
        this.passwordField = page.getByTestId("editUserAccount-password-field");

        // buttons
        this.saveChangesButton = page.getByTestId(
            "editUserAccount-saveChanges-button",
        );
        this.backButton = page.getByTestId("editUserAccount-back-button");

        // dialog
        this.changePasswordDialog = page.getByTestId(
            "editUserAccount-changePassword-dialog",
        );
        this.changePasswordTitle = page.getByTestId(
            "editUserAccount-changePassword-title",
        );

        this.adminPassword = page
            .getByTestId("editUserAccount-changePassword-adminPassword-input")
            .getByRole("textbox");
        this.newPassword = page
            .getByTestId("editUserAccount-changePassword-newPassword-input")
            .getByRole("textbox");
        this.confirmNewPassword = page
            .getByTestId(
                "editUserAccount-changePassword-confirmNewPassword-input",
            )
            .getByRole("textbox");

        this.changePasswordCancelButton = page.getByTestId(
            "editUserAccount-changePassword-cancel-button",
        );
        this.changePasswordSaveButton = page.getByTestId(
            "editUserAccount-changePassword-save-button",
        );

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

    async expectStillOnEditPage(uuid: string) {
        await expect(this.page).toHaveURL(
            new RegExp(`/user-accounts/edit-account/${uuid}(?:$|[?#])`, "i"),
            { timeout: 10_000 },
        );
    }

    // ------------------------
    // Select helpers
    // ------------------------
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

    async submitSaveChanges() {
        await this.saveChangesButton.click();
    }

    async clickBack() {
        await this.backButton.click();
    }

    // ------------------------
    // Status helpers
    // ------------------------
    async toggleStatusChip() {
        await this.statusChip.click();
    }

    async expectStatusChipActive() {
        await expect(this.statusChip).toContainText(/active/i);
    }

    async expectStatusChipInactive() {
        await expect(this.statusChip).toContainText(/inactive/i);
    }

    // ------------------------
    // Password dialog helpers
    // ------------------------
    async openChangePasswordDialog() {
        await this.passwordChangeOpen.click();
        await expect(this.changePasswordDialog).toBeVisible();
    }

    async closeChangePasswordDialog() {
        await this.changePasswordCancelButton.click();
        await expect(this.changePasswordDialog).toBeHidden();
    }

    async fillChangePasswordForm(params: {
        adminPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) {
        await this.adminPassword.fill(params.adminPassword);
        await this.newPassword.fill(params.newPassword);
        await this.confirmNewPassword.fill(params.confirmNewPassword);
    }

    async submitChangePassword() {
        await this.changePasswordSaveButton.click();
    }

    // ------------------------
    // Convenience Form Filler
    // ------------------------
    async fillEditForm(params: {
        roleName?: string;
        timezoneName?: string;
        pickFirstTimezone?: boolean;
        username?: string;
        name?: string;
        surname?: string;
        email?: string;
    }) {
        if (params.roleName) await this.selectRole(params.roleName);

        if (params.timezoneName) await this.selectTimezone(params.timezoneName);
        if (params.pickFirstTimezone) await this.pickFirstTimezone();

        if (params.username !== undefined)
            await this.fillUsername(params.username);
        if (params.name !== undefined) await this.fillName(params.name);
        if (params.surname !== undefined)
            await this.fillSurname(params.surname);
        if (params.email !== undefined) await this.fillEmail(params.email);
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
            timeout: 5_000,
        });
    }

    async expectRequiredFieldErrors(errors: {
        username?: string;
        name?: string;
        surname?: string;
        role?: string;
        timezone?: string;
        email?: string;
    }) {
        if (errors.username)
            await this.expectFieldError(
                "editUserAccount-username-input",
                errors.username,
            );

        if (errors.name)
            await this.expectFieldError(
                "editUserAccount-name-input",
                errors.name,
            );

        if (errors.surname)
            await this.expectFieldError(
                "editUserAccount-surname-input",
                errors.surname,
            );

        if (errors.timezone)
            await this.expectFieldError(
                "editUserAccount-timezone-select",
                errors.timezone,
            );

        if (errors.email)
            await this.expectFieldError(
                "editUserAccount-email-input",
                errors.email,
            );

        if (errors.role)
            await this.expectFieldError(
                "createUserAccount-role-select",
                errors.role,
            );
    }

    // Dialog validation helpers
    async expectPasswordDialogFieldError(testId: string, text: string) {
        await this.expectFieldError(testId, text);
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
    async expectEditRequestSucceeded(action: () => Promise<void>) {
        await expectRequestSucceeded({
            page: this.page,
            method: "PUT",
            urlRegex: this.userAccountUrlRegex,
            action,
            expectedStatus: 200,
        });
    }

    async captureEditResponse(action: () => Promise<void>): Promise<Response> {
        const respPromise = waitForResponse(
            this.page,
            "PUT",
            this.userAccountUrlRegex,
        );

        await action();
        return await respPromise;
    }

    async captureChangePasswordResponse(
        action: () => Promise<void>,
    ): Promise<Response> {
        const respPromise = waitForResponse(
            this.page,
            "PUT",
            this.userAccountPasswordUrlRegex,
        );

        await action();
        return await respPromise;
    }

    async expectNoEditRequest(action: () => Promise<void>) {
        await expectNoRequest({
            page: this.page,
            method: "PUT",
            urlRegex: this.userAccountUrlRegex,
            action,
            settleMs: 300,
        });
    }

    async expectStatusToggleRequestSucceeded(action: () => Promise<void>) {
        await expectRequestSucceeded({
            page: this.page,
            method: "POST",
            urlRegex: this.userAccountUrlRegex,
            action,
            expectedStatuses: [200, 204],
        });
    }

    async expectChangePasswordRequestSucceeded(action: () => Promise<void>) {
        await expectRequestSucceeded({
            page: this.page,
            method: "PUT",
            urlRegex: this.userAccountPasswordUrlRegex,
            action,
            expectedStatuses: [200, 204],
        });
    }

    async expectNoChangePasswordRequest(action: () => Promise<void>) {
        await expectNoRequest({
            page: this.page,
            method: "PUT",
            urlRegex: this.userAccountPasswordUrlRegex,
            action,
            settleMs: 300,
        });
    }
}
