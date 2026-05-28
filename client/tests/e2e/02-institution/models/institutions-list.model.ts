import { type Page } from "@playwright/test";
import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";

const institutionsListConfig: TableListPageConfig = {
    route: "/institution",
    testIdBase: "institutions",
    listRequest: {
        method: "GET",
        urlRegex: /\/institution\?/i,
        expectedStatuses: [200, 304],
    },
};

export class InstitutionsListModel extends TableListPageModel {
    constructor(page: Page) {
        super(page, institutionsListConfig);
    }

    statusFilterChip(status: "Active" | "Inactive") {
        return this.searchBar.filters.chip("statusFilter", status);
    }

    async toggleStatusFilter(status: "Active" | "Inactive") {
        await this.searchBar.filters.toggle("statusFilter", status);
    }
}
