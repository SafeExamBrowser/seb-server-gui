import { expect,type Page } from "@playwright/test";

import type { TableListPageConfig } from "../../../types/table-list-page.types.ts";
import { TableListPageModel } from "../../generic-models/table-list-page.model.ts";

export const EXAM_TEMPLATE_TYPE_FILTER_SUFFIX = "examType";

export const EXAM_TEMPLATE_LIST_COLUMN = {
    name: "name",
    description: "description",
    examType: "examType",
} as const;

const config: TableListPageConfig = {
    route: "/exam-template",
    testIdBase: "examTemplates",
    listRequest: {
        method: "GET",
        urlRegex: /\/api\/admin-api\/v1\/exam-template(?:$|\?)/i,
        expectedStatuses: [200, 304],
    },
};

export class ExamTemplateListModel extends TableListPageModel {
    constructor(page: Page) {
        super(page, config);
    }

    async toggleExamTypeFilter(examType: string) {
        //examTemplates-type-option-UNDEFINED

        //examTemplates-examType-option-UNDEFINED
        await this.searchBar.filters.toggle(
            EXAM_TEMPLATE_TYPE_FILTER_SUFFIX,
            examType,
        );
    }

    async toggleAddButton() {
        // await this.searchBar.filters.toggle(EXAM_TYPE_FILTER_SUFFIX, type);
    }

    async expectExamTemplateListVisible() {
        await expect(this.page.getByTestId("")).toBeVisible();
    }

    navigateButton(id: string | number) {
        return this.table.rowAction(id, "navigate");
    }
}
