import { type Page } from "@playwright/test";
import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";

const userAccountsListConfig: TableListPageConfig = {
    route: "/user-account",
    testIdBase: "userAccounts",
    listRequest: {
        method: "GET",
        urlRegex: /\/useraccount\?/i,
        expectedStatuses: [200, 304],
    },
};

export class UserAccountsListModel extends TableListPageModel {
    constructor(page: Page) {
        super(page, userAccountsListConfig);
    }

    statusFilterChip(status: "Active" | "Inactive") {
        return this.searchBar.filters.chip("statusFilter", status);
    }

    async toggleStatusFilter(status: "Active" | "Inactive") {
        await this.searchBar.filters.toggle("statusFilter", status);
    }

    institutionFilterSection() {
        return this.searchBar.filters.section("institutionFilter");
    }

    async toggleInstitutionFilter(institutionModelId: string | number) {
        await this.searchBar.filters.toggle(
            "institutionFilter",
            institutionModelId,
        );
    }

    async hasInstitutionFilter(): Promise<boolean> {
        return (await this.institutionFilterSection().count()) > 0;
    }

    async expectInstitutionFilterVisible() {
        await this.searchBar.filters.expectSectionVisible("institutionFilter");
    }

    async expectInstitutionFilterAbsent() {
        await this.searchBar.filters.expectSectionAbsent("institutionFilter");
    }
}
