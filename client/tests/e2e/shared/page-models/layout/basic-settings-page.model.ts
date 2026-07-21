import { expect, type Locator, type Page } from "@playwright/test";

import { AddButtonModel } from "../widgets/add-button.model";

export class BasicSettingsPageModel {
    readonly page: Page;
    readonly testIdBase: string;
    readonly pageTitle: Locator;
    readonly addButton: AddButtonModel;

    constructor(page: Page, testIdBase: string) {
        this.page = page;
        this.testIdBase = testIdBase;
        this.pageTitle = page.getByTestId(`${testIdBase}-page-title`);
        this.addButton = new AddButtonModel(page, testIdBase);
    }

    async expectVisible() {
        await expect(this.pageTitle).toBeVisible();
    }
}
