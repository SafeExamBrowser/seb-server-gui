import { expect, type Page } from "@playwright/test";


const ROUTE = "/exam-template/:id";


export class ExamTemplateModel {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async expectExamTemplateTitleVisible(title: string) {
        await expect(
            // this.page.getByTestId("exam-template-title"),
            this.page.getByTestId("examTemplateDetail-page-title"),
        ).toHaveText(title);
    }
}
