import { expect, type Locator, type Page } from "@playwright/test";

export type ConfirmDialogKind = "delete" | "status";

export class ConfirmDialogModel {
    readonly dialog: Locator;
    readonly title: Locator;
    readonly text: Locator;
    readonly cancelButton: Locator;
    readonly confirmButton: Locator;

    constructor(page: Page, testIdBase: string, kind: ConfirmDialogKind) {
        this.dialog = page.getByTestId(`${testIdBase}-${kind}-dialog`);
        this.title = page.getByTestId(`${testIdBase}-${kind}-dialog-title`);
        this.text = page.getByTestId(`${testIdBase}-${kind}-dialog-text`);
        this.cancelButton = page.getByTestId(
            `${testIdBase}-${kind}-cancel-button`,
        );
        this.confirmButton = page.getByTestId(
            `${testIdBase}-${kind}-confirm-button`,
        );
    }

    async expectVisible() {
        await expect(this.dialog).toBeVisible();
    }

    async expectHidden() {
        await expect(this.dialog).toBeHidden();
    }

    async confirm() {
        await this.confirmButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }
}
