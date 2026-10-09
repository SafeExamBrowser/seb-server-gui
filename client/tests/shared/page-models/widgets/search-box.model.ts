import { expect, type Locator, type Page } from "@playwright/test";

export class SearchBoxModel {
    readonly root: Locator;
    readonly input: Locator;

    constructor(page: Page, testIdBase: string) {
        this.root = page.getByTestId(`${testIdBase}-search-input`);
        this.input = this.root.getByRole("textbox");
    }

    async fill(value: string) {
        await this.input.fill(value);
    }

    async clearWithEscape() {
        await this.input.press("Escape");
    }

    async submitWithEnter() {
        await this.input.press("Enter");
    }

    async expectVisible() {
        await expect(this.input).toBeVisible();
    }

    async expectValue(value: string) {
        await expect(this.input).toHaveValue(value);
    }

    async expectEmpty() {
        await expect(this.input).toHaveValue("");
    }
}
