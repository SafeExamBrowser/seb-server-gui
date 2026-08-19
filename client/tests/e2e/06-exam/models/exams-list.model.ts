import { type Page } from "@playwright/test";

import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";

// Exam has no exam*ListConfig.ts (unlike institution/certificate/...): the
// list page hard-codes its route and testIdBase directly in index.vue.
export const EXAM_COLUMN = {
    name: "quizName",
    start: "quizStartTime",
    end: "quizEndTime",
} as const;

// useExamFilters.ts defines these filter sections without a testIdSuffix, so
// FiltersBar.vue falls back to the section key itself.
export const EXAM_STATUS_FILTER_SUFFIX = "status";
export const EXAM_TYPE_FILTER_SUFFIX = "type";

const config: TableListPageConfig = {
    route: "/exam",
    testIdBase: "exams",
    listRequest: {
        method: "GET",
        urlRegex: /\/api\/exam(?:$|\?)/i,
        expectedStatuses: [200, 304],
    },
};

export class ExamsListModel extends TableListPageModel {
    constructor(page: Page) {
        super(page, config);
    }

    async toggleStatusFilter(status: string) {
        await this.searchBar.filters.toggle(EXAM_STATUS_FILTER_SUFFIX, status);
    }

    async toggleTypeFilter(type: string) {
        await this.searchBar.filters.toggle(EXAM_TYPE_FILTER_SUFFIX, type);
    }

    navigateButton(id: string | number) {
        return this.table.rowAction(id, "navigate");
    }
}
