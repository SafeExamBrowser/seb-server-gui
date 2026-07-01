import { expect, type Locator, type Page } from "@playwright/test";
import { ConfirmButtonModel } from "./confirm-button.model";
import { FiltersBarModel } from "./filters-bar.model";
import { SearchBoxModel } from "./search-box.model";

export class SearchBarModel {
    readonly page: Page;
    readonly testIdBase: string;
    readonly root: Locator;
    readonly searchBox: SearchBoxModel;
    readonly searchButton: ConfirmButtonModel;
    readonly clearAllButton: Locator;
    readonly filters: FiltersBarModel;

    constructor(page: Page, testIdBase: string) {
        this.page = page;
        this.testIdBase = testIdBase;
        this.root = page.getByTestId(`${testIdBase}-filters-container`);
        this.searchBox = new SearchBoxModel(page, testIdBase);
        this.searchButton = new ConfirmButtonModel(
            page,
            `${testIdBase}-search-button`,
        );
        this.clearAllButton = page.getByTestId(
            `${testIdBase}-search-cancel-button`,
        );
        this.filters = new FiltersBarModel(page, testIdBase);
    }

    async expectVisible() {
        await expect(this.root).toBeVisible();
        await this.searchBox.expectVisible();
        await this.searchButton.expectVisible();
    }

    async submit() {
        await this.searchButton.click();
    }

    async search(value: string) {
        await this.searchBox.fill(value);
        await this.submit();
    }

    async clearAll() {
        await this.clearAllButton.click();
    }

    async expectInputValue(value: string) {
        await this.searchBox.expectValue(value);
    }

    async expectInputEmpty() {
        await this.searchBox.expectEmpty();
    }
}
