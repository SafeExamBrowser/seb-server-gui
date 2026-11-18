import { expect, type Locator, type Page } from "@playwright/test";

export class FiltersBarModel {
    readonly page: Page;
    readonly testIdBase: string;

    constructor(page: Page, testIdBase: string) {
        this.page = page;
        this.testIdBase = testIdBase;
    }

    section(testIdSuffix: string): Locator {
        return this.page.getByTestId(
            `${this.testIdBase}-${testIdSuffix}-section`,
        );
    }

    option(testIdSuffix: string, value: string | number): Locator {
        return this.page.getByTestId(
            `${this.testIdBase}-${testIdSuffix}-option-${value}`,
        );
    }

    async expectSectionVisible(testIdSuffix: string) {
        await expect(this.section(testIdSuffix)).toBeVisible();
    }

    async expectSectionAbsent(testIdSuffix: string) {
        await expect(this.section(testIdSuffix)).toHaveCount(0);
    }

    async toggle(testIdSuffix: string, value: string | number) {
        await this.option(testIdSuffix, value).click();
    }
}
