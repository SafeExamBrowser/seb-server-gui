import { expect, type Locator, type Page } from "@playwright/test";
import { ConfirmButtonModel } from "./confirm-button.model";
import { FormFieldModel } from "./form-field.model";

// The ChangePasswordDialog is shared by the edit and profile pages, so it has
// fixed test ids of its own (not tied to the host page's prefix).
export class ChangePasswordDialogModel {
    readonly dialog: Locator;
    readonly adminPassword: FormFieldModel;
    readonly newPassword: FormFieldModel;
    readonly confirmNewPassword: FormFieldModel;
    readonly saveButton: ConfirmButtonModel;
    readonly cancelButton: ConfirmButtonModel;

    constructor(page: Page) {
        this.dialog = page.getByTestId("changePassword-dialog");
        this.adminPassword = new FormFieldModel(
            page,
            "changePassword-form-field-adminPassword",
            "password",
        );
        this.newPassword = new FormFieldModel(
            page,
            "changePassword-form-field-newPassword",
            "password",
        );
        this.confirmNewPassword = new FormFieldModel(
            page,
            "changePassword-form-field-confirmNewPassword",
            "password",
        );
        this.saveButton = new ConfirmButtonModel(
            page,
            "changePassword-save-button",
        );
        this.cancelButton = new ConfirmButtonModel(
            page,
            "changePassword-cancel-button",
        );
    }

    async expectVisible() {
        await expect(this.dialog).toBeVisible();
    }

    async expectHidden() {
        await expect(this.dialog).toBeHidden();
    }

    async fill(input: { adminPassword: string; newPassword: string }) {
        await this.adminPassword.fill(input.adminPassword);
        await this.newPassword.fill(input.newPassword);
        await this.confirmNewPassword.fill(input.newPassword);
    }

    async save() {
        await this.saveButton.click();
    }
}
