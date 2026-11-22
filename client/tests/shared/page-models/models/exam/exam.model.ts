import { type Page } from "@playwright/test";

import en from "@/i18n/locales/en.json" with { type: "json" };

import { DetailPageModel } from "../../generic-models/detail-page.model.ts";

const ROUTE = "/exam/:id";
const PREFIX = "examDetail";
const PAGE_TEST_ID = "exam-details-page";

export type ExamBasicSettingsExpectation = {
    name: string;
    startUrl: string;
    start: string;
    end: string;
    examType: string;
};

export class ExamModel extends DetailPageModel {
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

    async expectBasicSettings(expected: ExamBasicSettingsExpectation) {
        await this.expectBasicSettingText(
            en.examDetail.info.name,
            expected.name,
        );
        await this.expectBasicSettingText(
            en.examDetail.info.url,
            expected.startUrl,
        );
        await this.expectBasicSettingText(
            en.examDetail.info.start,
            expected.start,
        );
        await this.expectBasicSettingText(en.examDetail.info.end, expected.end);
        await this.expectBasicSettingText(
            en.examDetail.info.type,
            expected.examType,
        );
    }
}
