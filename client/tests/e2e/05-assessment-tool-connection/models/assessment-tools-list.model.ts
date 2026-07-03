import { type Page } from "@playwright/test";
import { assessmentToolListConfig } from "@/pages/(app)/assessment-tool/assessmentToolListConfig.ts";
import {
    INSTITUTION_FILTER,
    LMS_TYPE_FILTER,
    STATUS_FILTER,
    type StatusFilterValue,
} from "@/components/widgets/filters/filterContracts.ts";
import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";
import { entityRowActionRequests } from "../../utils/entityRowRequests";

export const assessmentToolRowRequests = entityRowActionRequests("/lms-setup");

const config: TableListPageConfig = {
    route: assessmentToolListConfig.route,
    testIdBase: assessmentToolListConfig.testIdBase,
    listRequest: {
        method: "GET",
        urlRegex: /\/lms-setup\?/i,
        expectedStatuses: [200, 304],
    },
};

export class AssessmentToolsListModel extends TableListPageModel {
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

    typeFilterOption(type: string) {
        return this.searchBar.filters.option(
            LMS_TYPE_FILTER.testIdSuffix,
            type,
        );
    }

    async toggleTypeFilter(type: string) {
        await this.searchBar.filters.toggle(LMS_TYPE_FILTER.testIdSuffix, type);
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
