import { expect, type Locator, type Page } from "@playwright/test";
import {
    expectRequestSucceeded,
    waitForRequest,
} from "../../utils/networkAssertions";
import { PlaywrightCreateConnectionConfigurationPage } from "./playwright-create-connection-configuration-page";
import { PlaywrightConnectionConfigurationEditPage } from "./playwright-connection-configuration-page";

export class PlaywrightConnectionConfigurationsPage {
    readonly page: Page;

    // Page identity / layout
    readonly pageTitle: Locator;
    readonly addConnectionConfigurationButton: Locator;
    readonly filtersContainer: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly cancelButton: Locator;
    readonly statusFilterContainer: Locator;
    readonly institutionFilterContainer: Locator;
    readonly table: Locator;
    readonly tableHeadersComponent: Locator;

    // Delete dialog
    readonly deleteDialog: Locator;
    readonly deleteCancelButton: Locator;
    readonly deleteConfirmButton: Locator;

    // Status dialog
    readonly statusDialog: Locator;
    readonly statusDialogTitle: Locator;
    readonly statusDialogMessage: Locator;
    readonly statusDialogCancelButton: Locator;
    readonly statusDialogConfirmButton: Locator;

    // Toasts
    readonly toast: Locator;
    readonly toastText: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageTitle = page.getByTestId(
            "connectionConfigurations-title-text",
        );
        this.addConnectionConfigurationButton = page.getByTestId(
            "connectionConfigurations-addConnectionConfiguration-button",
        );

        this.filtersContainer = page.getByTestId(
            "connectionConfigurations-filters-container",
        );
        this.searchInput = page
            .getByTestId("connectionConfigurations-search-input")
            .getByRole("textbox");
        this.searchButton = page.getByTestId(
            "connectionConfigurations-search-button",
        );
        this.cancelButton = page.getByTestId(
            "connectionConfigurations-search-cancel-button",
        );

        this.statusFilterContainer = page.getByTestId(
            "connectionConfigurations-statusFilter-container",
        );
        this.institutionFilterContainer = page.getByTestId(
            "connectionConfigurations-institutionFilter-container",
        );

        this.table = page.getByTestId("connectionConfigurations-table");
        this.tableHeadersComponent = page.getByTestId(
            "connectionConfigurations-tableHeaders-component",
        );

        this.deleteDialog = page.getByTestId(
            "connectionConfigurations-deleteDialog-dialog",
        );
        this.deleteCancelButton = page.getByTestId(
            "connectionConfigurations-deleteDialog-cancel-button",
        );
        this.deleteConfirmButton = page.getByTestId(
            "connectionConfigurations-deleteDialog-confirm-button",
        );

        this.statusDialog = page.getByTestId(
            "connectionConfigurations-statusDialog-dialog",
        );
        this.statusDialogTitle = page.getByTestId(
            "connectionConfigurations-statusDialog-title",
        );
        this.statusDialogMessage = page.getByTestId(
            "connectionConfigurations-statusDialog-message",
        );
        this.statusDialogCancelButton = page.getByTestId(
            "connectionConfigurations-statusDialog-cancel-button",
        );
        this.statusDialogConfirmButton = page.getByTestId(
            "connectionConfigurations-statusDialog-confirm-button",
        );

        this.toast = page.locator(".toast-item[role='alert']");
        this.toastText = this.toast.locator(".toast-text");
    }

    async goto() {
        await this.page.goto("/connection-configurations");
        await this.expectVisible();
    }

    async expectVisible() {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.table).toBeVisible();
    }

    row(id: string | number): Locator {
        return this.page.getByTestId(`connectionConfigurations-row-${id}`);
    }

    statusChip(id: string | number): Locator {
        return this.page.getByTestId(
            `connectionConfigurations-status-chip-${id}`,
        );
    }

    editButton(id: string | number): Locator {
        return this.page.getByTestId(
            `connectionConfigurations-edit-button-${id}`,
        );
    }

    deleteButton(id: string | number): Locator {
        return this.page.getByTestId(
            `connectionConfigurations-delete-button-${id}`,
        );
    }

    statusFilterChip(status: "Active" | "Inactive"): Locator {
        return this.page.getByTestId(
            `connectionConfigurations-statusFilter-chip-${status}`,
        );
    }

    institutionFilterChip(institutionId: string | number): Locator {
        return this.page.getByTestId(
            `connectionConfigurations-institutionFilter-chip-${institutionId}`,
        );
    }

    async navigateToCreateConnectionConfiguration(): Promise<PlaywrightCreateConnectionConfigurationPage> {
        await this.addConnectionConfigurationButton.click();
        const createPage = new PlaywrightCreateConnectionConfigurationPage(
            this.page,
        );
        await createPage.expectVisible();
        return createPage;
    }

    async fillSearch(value: string) {
        await this.searchInput.fill(value);
    }

    async searchByButton() {
        await this.searchButton.click();
    }

    async clearSearch() {
        await this.cancelButton.click();
    }

    async search(value: string) {
        await this.fillSearch(value);
        await this.searchByButton();
    }

    async toggleStatusFilter(status: "Active" | "Inactive") {
        await this.statusFilterChip(status).click();
    }

    async toggleInstitutionFilter(institutionId: string | number) {
        await this.institutionFilterChip(institutionId).click();
    }

    async clickEditButton(
        id: string | number,
    ): Promise<PlaywrightConnectionConfigurationEditPage> {
        await this.editButton(id).click();
        const editPage = new PlaywrightConnectionConfigurationEditPage(
            this.page,
        );
        await editPage.expectVisible();
        return editPage;
    }

    async clickDeleteButton(id: string | number) {
        await this.deleteButton(id).click();
    }

    async clickStatusChip(id: string | number) {
        await this.statusChip(id).click();
    }

    async expectDeleteDialogVisible() {
        await expect(this.deleteDialog).toBeVisible();
    }

    async expectStatusDialogVisible() {
        await expect(this.statusDialog).toBeVisible();
    }

    async confirmDelete() {
        await this.deleteConfirmButton.click();
    }

    async confirmStatusChange() {
        await this.statusDialogConfirmButton.click();
    }

    async cancelStatusChange() {
        await this.statusDialogCancelButton.click();
    }

    async expectRowVisible(id: string | number) {
        await expect(this.row(id)).toBeVisible();
    }

    async expectStatusText(id: string | number, text: "Active" | "Inactive") {
        await expect(this.statusChip(id)).toHaveText(text);
    }

    async expectErrorToast(contains: string[]) {
        await expect(this.toast).toBeVisible();
        for (const part of contains) {
            await expect(this.toastText).toContainText(part);
        }
    }
    headerByText(text: string): Locator {
        return this.tableHeadersComponent.getByText(text, { exact: true });
    }

    async sortByHeaderText(text: string) {
        await this.headerByText(text).click();
    }

    paginationRoot(): Locator {
        return this.table.locator(".v-pagination");
    }

    async expectConnectionConfigurationsListRequestSucceeded(
        action: () => Promise<void>,
        opts?: {
            expectedStatuses?: number[];
            urlMustContain?: Array<string | RegExp>;
        },
    ) {
        const expectedStatuses = opts?.expectedStatuses ?? [200, 304];

        const urlRegex = /\/client_configuration(?:\?|$)/i;
        const requestPromise = waitForRequest(this.page, "GET", urlRegex);

        await expectRequestSucceeded({
            page: this.page,
            method: "GET",
            urlRegex,
            action,
            expectedStatuses,
        });

        const req = await requestPromise;

        if (opts?.urlMustContain?.length) {
            for (const must of opts.urlMustContain) {
                if (must instanceof RegExp) {
                    expect(req.url()).toMatch(must);
                } else {
                    expect(req.url()).toContain(must);
                }
            }
        }
    }

    async expectDeleteRequestSucceeded(
        id: string | number,
        action: () => Promise<void>,
    ) {
        const urlRegex = new RegExp(
            `/client_configuration/${id}(?:$|\\?)`,
            "i",
        );

        await expectRequestSucceeded({
            page: this.page,
            method: "DELETE",
            urlRegex,
            action,
            expectedStatus: 200,
        });
    }

    async expectDeactivateRequestSucceeded(
        id: string | number,
        action: () => Promise<void>,
    ) {
        const urlRegex = new RegExp(
            `/client_configuration/${id}/inactive(?:\\?|$)`,
            "i",
        );

        await expectRequestSucceeded({
            page: this.page,
            method: "POST",
            urlRegex,
            action,
            expectedStatus: 200,
        });
    }

    async expectActivateRequestSucceeded(
        id: string | number,
        action: () => Promise<void>,
    ) {
        const urlRegex = new RegExp(
            `/client_configuration/${id}/active(?:\\?|$)`,
            "i",
        );

        await expectRequestSucceeded({
            page: this.page,
            method: "POST",
            urlRegex,
            action,
            expectedStatus: 200,
        });
    }
}
