import { type Page } from "@playwright/test";

import {
    INSTITUTION_FILTER,
    STATUS_FILTER,
    type StatusFilterValue,
} from "@/components/widgets/filters/filterContracts.ts";
import { userAccountListConfig } from "@/pages/(app)/user-account/userAccountListConfig.ts";

import { TableListPageModel } from "../../generic-models/table-list-page.model.ts";
import type { TableListPageConfig } from "../../../types/table-list-page.types.ts";
import { entityRowActionRequests } from "../../../../utils/entityRowRequests.ts";

export const userAccountRowRequests = entityRowActionRequests("/useraccount");

const config: TableListPageConfig = {
    route: userAccountListConfig.route,
    testIdBase: userAccountListConfig.testIdBase,
    listRequest: {
        method: "GET",
        urlRegex: /\/useraccount\?/i,
        expectedStatuses: [200, 304],
    },
};

export class UserAccountsListModel extends TableListPageModel {
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

    institutionFilterSection() {
        return this.searchBar.filters.section(INSTITUTION_FILTER.testIdSuffix);
    }

    async toggleInstitutionFilter(institutionModelId: string | number) {
        await this.searchBar.filters.toggle(
            INSTITUTION_FILTER.testIdSuffix,
            institutionModelId,
        );
    }

    async hasInstitutionFilter(): Promise<boolean> {
        return (await this.institutionFilterSection().count()) > 0;
    }

    async expectInstitutionFilterVisible() {
        await this.searchBar.filters.expectSectionVisible(
            INSTITUTION_FILTER.testIdSuffix,
        );
    }

    async expectInstitutionFilterAbsent() {
        await this.searchBar.filters.expectSectionAbsent(
            INSTITUTION_FILTER.testIdSuffix,
        );
    }
}
