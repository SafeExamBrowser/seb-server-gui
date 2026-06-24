import { expect, type Page } from "@playwright/test";
import {
    expectRequestSucceeded,
    waitForRequest,
    waitForResponse,
} from "../../../utils/networkAssertions";
import { BasicSettingsPageModel } from "../layout/basic-settings-page.model";
import { ConfirmDialogModel } from "../widgets/confirm-dialog.model";
import { EntityTableModel } from "../widgets/entity-table.model";
import { SearchBarModel } from "../widgets/search-bar.model";
import type {
    TableListPageConfig,
    UrlExpectation,
} from "../../types/table-list-page.types";

export class TableListPageModel {
    readonly page: Page;
    readonly config: TableListPageConfig;
    readonly layout: BasicSettingsPageModel;
    readonly searchBar: SearchBarModel;
    readonly table: EntityTableModel;
    readonly deleteDialog: ConfirmDialogModel;
    readonly statusDialog: ConfirmDialogModel;

    constructor(page: Page, config: TableListPageConfig) {
        this.page = page;
        this.config = config;
        this.layout = new BasicSettingsPageModel(page, config.testIdBase);
        this.searchBar = new SearchBarModel(page, config.testIdBase);
        this.table = new EntityTableModel(page, config.testIdBase);
        this.deleteDialog = new ConfirmDialogModel(
            page,
            config.testIdBase,
            "delete",
        );
        this.statusDialog = new ConfirmDialogModel(
            page,
            config.testIdBase,
            "status",
        );
    }

    async goto() {
        const { method, urlRegex } = this.config.listRequest;
        const listLoaded = waitForResponse(this.page, method, urlRegex);
        await this.page.goto(this.config.route);
        await listLoaded;
        await this.expectVisible();
    }

    async expectVisible() {
        await this.layout.expectVisible();
        await this.searchBar.expectVisible();
        await this.table.expectVisible();
    }

    async expectListRequestSucceeded(
        action: () => Promise<void>,
        opts?: {
            expectedStatuses?: number[];
            urlMustContain?: UrlExpectation[];
        },
    ) {
        const expectedStatuses = opts?.expectedStatuses ??
            this.config.listRequest.expectedStatuses ?? [200, 304];
        const { method, urlRegex } = this.config.listRequest;
        const requestPromise = waitForRequest(this.page, method, urlRegex);

        await expectRequestSucceeded({
            page: this.page,
            method,
            urlRegex,
            action,
            expectedStatuses,
        });

        const req = await requestPromise;

        for (const must of opts?.urlMustContain ?? []) {
            if (must instanceof RegExp) {
                expect(req.url()).toMatch(must);
            } else {
                expect(req.url()).toContain(must);
            }
        }
    }

    async search(value: string) {
        await this.searchBar.search(value);
    }

    async clearSearchAndFilters() {
        await this.searchBar.clearAll();
    }
}
