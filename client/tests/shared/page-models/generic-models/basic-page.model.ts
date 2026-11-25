import { expect, type Locator, type Page } from "@playwright/test";

import { ContainerLayoutModel } from "../layout/container-layout.model.ts";

export type BasicPageConfig = {
    // May contain an `:id` placeholder (e.g. "/exam-template/:id") that `goto(id)` fills in.
    route: string;
    // The `data-test-id` passed to the page's `BasicPage` (e.g. "examTemplateDetail").
    testPrefix: string;
    // The `pageTestId` from the route's `definePage` meta (e.g. "exam-template-detail-page").
    pageTestId: string;
};

export class BasicPageModel {
    readonly page: Page;
    readonly config: BasicPageConfig;
    readonly layout: ContainerLayoutModel;
    readonly pageTitle: Locator;

    constructor(page: Page, config: BasicPageConfig) {
        this.page = page;
        this.config = config;
        this.layout = new ContainerLayoutModel(page, config.pageTestId);
        this.pageTitle = page.getByTestId(`${config.testPrefix}-page-title`);
    }

    url(id?: number | string) {
        if (id === undefined) {
            return this.config.route;
        }
        return this.config.route.replace(":id", String(id));
    }

    async goto(id?: number | string) {
        await this.page.goto(this.url(id));
        await this.expectVisible();
    }

    async expectVisible() {
        await this.layout.expectVisible();
        await expect(this.pageTitle).toBeVisible();
    }

    async expectTitle(title: string) {
        await expect(this.pageTitle).toHaveText(title);
    }
}
