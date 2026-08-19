import { expect, type Page } from "@playwright/test";

import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";

// Archive has no archive*ListConfig.ts: the list page hard-codes its route
// and testIdBase directly in index.vue, and reads headers from
// useExamTableHeaders.ts (shared with 06-exam and 07-monitoring). It reuses
// the plain /exam collection (see examService.ts getExams), so its list
// request regex is identical to 06-exam's.
export const ARCHIVE_COLUMN = {
    name: "quizName",
    start: "quizStartTime",
    end: "quizEndTime",
} as const;

// useArchiveTableFilters.ts reuses the exam family's filter keys
// (EXAM_STATUS_FILTER_KEY / TYPE_FILTER_KEY) without a testIdSuffix, so
// FiltersBar.vue falls back to the section key itself.
export const ARCHIVE_STATUS_FILTER_SUFFIX = "status";
export const ARCHIVE_TYPE_FILTER_SUFFIX = "type";

const config: TableListPageConfig = {
    route: "/archive",
    testIdBase: "archive",
    listRequest: {
        method: "GET",
        urlRegex: /\/api\/exam(?:$|\?)/i,
        expectedStatuses: [200, 304],
    },
};

export class ArchiveListModel extends TableListPageModel {
    constructor(page: Page) {
        super(page, config);
    }

    async toggleStatusFilter(status: string) {
        await this.searchBar.filters.toggle(
            ARCHIVE_STATUS_FILTER_SUFFIX,
            status,
        );
    }

    async toggleTypeFilter(type: string) {
        await this.searchBar.filters.toggle(ARCHIVE_TYPE_FILTER_SUFFIX, type);
    }

    archiveButton(id: string | number) {
        return this.table.rowAction(id, "archiveExam");
    }

    // The single-exam ConfirmDialog on 09-archive/index.vue is rendered
    // without the `test-ids` prop (unlike Delete/StatusConfirmDialog on
    // other domains), so it exposes no data-testid; fall back to its
    // translated copy (examList.archive.confirm.* / general.cancelButton).
    archiveDialogTitle() {
        return this.page.getByText("Archive this exam?", { exact: true });
    }

    archiveDialogCancelButton() {
        return this.page.getByRole("button", { name: "Cancel" });
    }

    archiveDialogConfirmButton() {
        return this.page.getByRole("button", { name: "Archive", exact: true });
    }

    async expectArchiveDialogVisible() {
        await expect(this.archiveDialogTitle()).toBeVisible();
    }

    async expectArchiveDialogHidden() {
        await expect(this.archiveDialogTitle()).toBeHidden();
    }
}
