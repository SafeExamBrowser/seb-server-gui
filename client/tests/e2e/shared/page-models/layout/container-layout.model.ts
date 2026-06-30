import { expect, type Locator, type Page } from "@playwright/test";

export class ContainerLayoutModel {
    readonly page: Page;
    readonly pageTestId: string;
    readonly pageContainer: Locator;

    constructor(page: Page, pageTestId: string) {
        this.page = page;
        this.pageTestId = pageTestId;
        this.pageContainer = page.getByTestId(`${pageTestId}-page-container`);
    }

    async expectVisible() {
        await expect(this.pageContainer).toBeVisible();
    }
}
