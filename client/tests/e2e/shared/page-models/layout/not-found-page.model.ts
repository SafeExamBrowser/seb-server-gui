import { expect, type Locator, type Page } from "@playwright/test";

import { ContainerLayoutModel } from "./container-layout.model";

export class NotFoundPageModel {
    readonly page: Page;
    readonly layout: ContainerLayoutModel;
    readonly headline: Locator;
    readonly backToHomeLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.layout = new ContainerLayoutModel(page, "not-found-page");
        this.headline = this.layout.pageContainer.getByText("404", {
            exact: true,
        });
        this.backToHomeLink = this.layout.pageContainer.getByRole("link", {
            name: "Back to home",
        });
    }

    async goto(path: string) {
        await this.page.goto(path);
    }

    async expectVisible() {
        await this.layout.expectVisible();
        await expect(this.headline).toBeVisible();
        await expect(this.backToHomeLink).toBeVisible();
    }

    async backToHome() {
        await this.backToHomeLink.click();
    }
}
