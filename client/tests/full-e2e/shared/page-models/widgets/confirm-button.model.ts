import { expect, type Locator, type Page } from "@playwright/test";

export class ConfirmButtonModel {
    readonly button: Locator;

    constructor(page: Page, testId: string) {
        this.button = page.getByTestId(testId);
    }

    async click() {
        await this.button.click();
    }

    async expectVisible() {
        await expect(this.button).toBeVisible();
    }

    async expectEnabled() {
        await expect(this.button).toBeEnabled();
    }

    async expectDisabled() {
        await expect(this.button).toBeDisabled();
    }
}
