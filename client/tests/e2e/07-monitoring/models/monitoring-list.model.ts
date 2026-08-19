import { type Page } from "@playwright/test";

import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";

// Monitoring has no monitoring*ListConfig.ts: the list page hard-codes its
// route and testIdBase directly in index.vue.
export const MONITORING_COLUMN = {
    name: "quizName",
    start: "quizStartTime",
    end: "quizEndTime",
} as const;

// useMonitoringFilters.ts defines these filter sections without a
// testIdSuffix, so FiltersBar.vue falls back to the section key itself.
export const MONITORING_STATUS_FILTER_SUFFIX = "status";
export const MONITORING_TYPE_FILTER_SUFFIX = "type";

const config: TableListPageConfig = {
    route: "/monitoring",
    testIdBase: "monitoring",
    listRequest: {
        method: "GET",
        // Anchored so it does not also match /monitoring/finishedexams (the
        // 08-analyze endpoint) or /monitoring/{examId} detail routes.
        urlRegex: /\/api\/monitoring(?:$|\?)/i,
        expectedStatuses: [200, 304],
    },
};

export class MonitoringListModel extends TableListPageModel {
    constructor(page: Page) {
        super(page, config);
    }

    async toggleStatusFilter(status: string) {
        await this.searchBar.filters.toggle(
            MONITORING_STATUS_FILTER_SUFFIX,
            status,
        );
    }

    async toggleTypeFilter(type: string) {
        await this.searchBar.filters.toggle(
            MONITORING_TYPE_FILTER_SUFFIX,
            type,
        );
    }

    navigateButton(id: string | number) {
        return this.table.rowAction(id, "navigate");
    }
}
