import { expect, type Page, type Request } from "@playwright/test";
import {
    expectRequestSucceeded,
    waitForRequest,
    waitForResponse,
    type HttpMethod,
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

    // Opens the delete dialog for a row, confirms it, and resolves with the
    // DELETE request the confirmation fired. The caller mocks the endpoint and
    // asserts the request; `request` is the per-domain row-delete matcher.
    async confirmDelete(
        id: string | number,
        opts: { request: RegExp },
    ): Promise<Request> {
        const requestPromise = waitForRequest(
            this.page,
            "DELETE",
            opts.request,
        );
        await this.table.deleteButton(id).click();
        await this.deleteDialog.expectVisible();
        await this.deleteDialog.confirm();
        const request = await requestPromise;
        await this.deleteDialog.expectHidden();
        return request;
    }

    // Opens the status dialog from a row's status chip, confirms it, and resolves
    // with the activate/deactivate request. The direction depends on the row's
    // current state, so the caller passes the expected method and matcher.
    async confirmStatusChange(
        id: string | number,
        opts: { method: HttpMethod; request: RegExp },
    ): Promise<Request> {
        const requestPromise = waitForRequest(
            this.page,
            opts.method,
            opts.request,
        );
        await this.table.statusChip(id).click();
        await this.statusDialog.expectVisible();
        await this.statusDialog.confirm();
        const request = await requestPromise;
        await this.statusDialog.expectHidden();
        return request;
    }
}
