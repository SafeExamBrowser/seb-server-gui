import { type Page } from "@playwright/test";

import { BasicPageModel } from "../../generic-models/basic-page.model.ts";

const ROUTE = "/exam/:id";
const PREFIX = "examDetail";
const PAGE_TEST_ID = "exam-details-page";

export class ExamModel extends BasicPageModel {
    constructor(page: Page) {
        super(page, {
            route: ROUTE,
            testPrefix: PREFIX,
            pageTestId: PAGE_TEST_ID,
        });
    }

    async expectExamTitleVisible(title: string) {
        await this.expectTitle(title);
    }
}
