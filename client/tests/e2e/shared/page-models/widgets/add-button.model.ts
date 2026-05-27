import { expect, type Locator, type Page } from "@playwright/test";

export class AddButtonModel {
    readonly button: Locator;

    constructor(page: Page, testIdBase: string) {
        this.button = page.getByTestId(`${testIdBase}-add-button`);
    }

    async click() {
        await this.button.click();
    }

    async expectVisible() {
        await expect(this.button).toBeVisible();
    }
}
