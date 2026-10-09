import { expect, type Locator, type Page } from "@playwright/test";

export class ExamTemplateCreateModel {
    readonly page: Page;



    constructor(page: Page) {
        this.page = page;
    }


    async goto(){
        await this.page.goto("/exam-template/create");
        await this.expectStartPageVisible();
    }

    async expectStartPageVisible(){
        await expect(
            this.page.getByTestId("exam-template-step1"),
        ).toBeVisible();
    }



}
