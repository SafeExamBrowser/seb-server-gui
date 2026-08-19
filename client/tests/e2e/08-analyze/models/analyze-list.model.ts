import { type Page } from "@playwright/test";

import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";

// Analyze has no analyze*ListConfig.ts: the list page hard-codes its route
// and testIdBase directly in index.vue, and reads headers from
// useExamTableHeaders.ts (shared with 06-exam and 07-monitoring).
export const ANALYZE_COLUMN = {
    name: "quizName",
    start: "quizStartTime",
    end: "quizEndTime",
} as const;

// useAnalyzeTableFilters.ts reuses the exam family's filter keys
// (EXAM_STATUS_FILTER_KEY / TYPE_FILTER_KEY) without a testIdSuffix, so
// FiltersBar.vue falls back to the section key itself.
export const ANALYZE_STATUS_FILTER_SUFFIX = "status";
export const ANALYZE_TYPE_FILTER_SUFFIX = "type";

const config: TableListPageConfig = {
    route: "/analyze",
    testIdBase: "analyze",
    listRequest: {
        method: "GET",
        urlRegex: /\/api\/monitoring\/finishedexams(?:$|\?)/i,
        expectedStatuses: [200, 304],
    },
};

export class AnalyzeListModel extends TableListPageModel {
    constructor(page: Page) {
        super(page, config);
    }

    async toggleStatusFilter(status: string) {
        await this.searchBar.filters.toggle(
            ANALYZE_STATUS_FILTER_SUFFIX,
            status,
        );
    }

    async toggleTypeFilter(type: string) {
        await this.searchBar.filters.toggle(ANALYZE_TYPE_FILTER_SUFFIX, type);
    }

    showScreenProctoringButton(id: string | number) {
        return this.table.rowAction(id, "showScreenProctoring");
    }

    downloadSebLogsButton(id: string | number) {
        return this.table.rowAction(id, "downloadSEBLogs");
    }
}
