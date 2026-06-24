import { type Page } from "@playwright/test";
import { userAccountListConfig } from "@/pages/(app)/user-account/userAccountListConfig.ts";
import {
    INSTITUTION_FILTER,
    STATUS_FILTER,
    type StatusFilterValue,
} from "@/components/widgets/filters/filterContracts.ts";
import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";

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
