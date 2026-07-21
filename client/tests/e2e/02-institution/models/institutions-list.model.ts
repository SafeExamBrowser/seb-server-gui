import { type Page } from "@playwright/test";

import {
    STATUS_FILTER,
    type StatusFilterValue,
} from "@/components/widgets/filters/filterContracts.ts";
import { institutionListConfig } from "@/pages/(app)/institution/institutionListConfig.ts";

import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";

const config: TableListPageConfig = {
    route: institutionListConfig.route,
    testIdBase: institutionListConfig.testIdBase,
    listRequest: {
        method: "GET",
        urlRegex: /\/institution\?/i,
        expectedStatuses: [200, 304],
    },
};

export class InstitutionsListModel extends TableListPageModel {
    constructor(page: Page) {
        super(page, config);
    }

    statusFilterOption(status: StatusFilterValue) {
        return this.searchBar.filters.option(
            STATUS_FILTER.testIdSuffix,
            status,
        );
    }

    async toggleStatusFilter(status: StatusFilterValue) {
        await this.searchBar.filters.toggle(STATUS_FILTER.testIdSuffix, status);
    }
}
