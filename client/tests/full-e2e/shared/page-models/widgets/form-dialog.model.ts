import { expect, type Locator, type Page } from "@playwright/test";

// Mirrors the test ids FormDialog.vue derives from its `dataTestId` prop; the embedded
// FormBuilder namespaces its fields under `formTestId` (`<formTestId>-field-<name>`).
export class FormDialogModel {
    readonly root: Locator;
    readonly formTestId: string;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page, testIdBase: string) {
        this.root = page.getByTestId(`${testIdBase}-create-dialog`);
        this.formTestId = `${testIdBase}-create-dialog-form`;
        this.submitButton = page.getByTestId(
            `${testIdBase}-create-dialog-submit-button`,
        );
        this.cancelButton = page.getByTestId(
            `${testIdBase}-create-dialog-cancel-button`,
        );
    }

    async expectVisible() {
        await expect(this.root).toBeVisible();
    }

    async expectHidden() {
        await expect(this.root).toBeHidden();
    }

    async submit() {
        await this.submitButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }
}
