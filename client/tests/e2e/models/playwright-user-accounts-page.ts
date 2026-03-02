import { expect, type Locator, type Page } from "@playwright/test";
import {
    expectRequestSucceeded,
    waitForRequest,
} from "../utils/networkAssertions";
import { PlaywrightCreateUserAccountPage } from "./playwright-create-user-account-page";

export class PlaywrightUserAccountsPage {
    readonly page: Page;

    // Page identity / layout
    readonly listContainer: Locator;
    readonly pageTitle: Locator;
    readonly settingsNavigation: Locator;

    // Header
    readonly headerRow: Locator;
    readonly titleText: Locator;
    readonly addUserButton: Locator;

    // Search section
    readonly searchSection: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly cancelButton: Locator;

    // Filters
    readonly statusFilterSection: Locator;
    readonly statusFilterChipsContainer: Locator;

    readonly institutionFilterSection: Locator;
    readonly institutionFilterChipsContainer: Locator;

    // Table
    readonly tableSection: Locator;
    readonly table: Locator;
    readonly tableHeadersComponent: Locator;

    // Dialogs: Delete
    readonly deleteDialog: Locator;
    readonly deleteDialogTitle: Locator;
    readonly deleteDialogText: Locator;
    readonly deleteCancelButton: Locator;
    readonly deleteConfirmButton: Locator;

    // Dialogs: Status
    readonly statusDialog: Locator;
    readonly statusDialogTitle: Locator;
    readonly statusDialogText: Locator;
    readonly statusCancelButton: Locator;
    readonly statusConfirmButton: Locator;

    // Misc / UI messages
    readonly anyVuetifyValidationMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Page identity / layout
        this.pageTitle = page.getByTestId("userAccounts-page-title");
        this.settingsNavigation = page.getByTestId(
            "userAccounts-settingsNavigation-component",
        );
        this.listContainer = page.getByTestId("userAccounts-list-container");

        // Header
        this.headerRow = page.getByTestId("userAccounts-header-row");
        this.titleText = page.getByTestId("userAccounts-title-text");
        this.addUserButton = page.getByTestId("userAccounts-addUser-button");

        // Search section
        this.searchSection = page.getByTestId("userAccounts-search-section");
        this.searchInput = page
            .getByTestId("userAccounts-search-input")
            .getByRole("textbox");
        this.searchButton = page.getByTestId("userAccounts-search-button");
        this.cancelButton = page.getByTestId("userAccounts-cancel-button");

        // Filters
        this.statusFilterSection = page.getByTestId(
            "userAccounts-statusFilter-section",
        );
        this.statusFilterChipsContainer = page.getByTestId(
            "userAccounts-statusFilter-chips",
        );

        this.institutionFilterSection = page.getByTestId(
            "userAccounts-institutionFilter-section",
        );
        this.institutionFilterChipsContainer = page.getByTestId(
            "userAccounts-institutionFilter-chips",
        );

        // Table
        this.tableSection = page.getByTestId("userAccounts-table-section");
        this.table = page.getByTestId("userAccounts-table");
        this.tableHeadersComponent = page.getByTestId(
            "userAccounts-tableHeaders-component",
        );

        // Delete dialog
        this.deleteDialog = page.getByTestId("userAccounts-delete-dialog");
        this.deleteDialogTitle = page.getByTestId(
            "userAccounts-delete-dialog-title",
        );
        this.deleteDialogText = page.getByTestId(
            "userAccounts-delete-dialog-text",
        );
        this.deleteCancelButton = page.getByTestId(
            "userAccounts-delete-cancel-button",
        );
        this.deleteConfirmButton = page.getByTestId(
            "userAccounts-delete-confirm-button",
        );

        // Status dialog
        this.statusDialog = page.getByTestId("userAccounts-status-dialog");
        this.statusDialogTitle = page.getByTestId(
            "userAccounts-status-dialog-title",
        );
        this.statusDialogText = page.getByTestId(
            "userAccounts-status-dialog-text",
        );
        this.statusCancelButton = page.getByTestId(
            "userAccounts-status-cancel-button",
        );
        this.statusConfirmButton = page.getByTestId(
            "userAccounts-status-confirm-button",
        );

        // Toast verify
        this.anyVuetifyValidationMessage = page.locator(".v-alert");
    }

    // ------------------------
    // Navigation / State
    // ------------------------

    async goto() {
        await this.page.goto("/user-accounts");
        await this.expectVisible();
    }

    async expectVisible() {
        await expect(this.listContainer).toBeVisible();
        await expect(this.tableSection).toBeVisible();
    }

    async expectInstitutionFilterVisible() {
        await expect(this.institutionFilterSection).toBeVisible();
    }

    async expectInstitutionFilterNotVisible() {
        await expect(this.institutionFilterSection).toHaveCount(0);
    }

    // ------------------------
    // Dynamic locators
    // ------------------------

    row(uuid: string): Locator {
        return this.page.getByTestId(`userAccounts-row-${uuid}`);
    }

    statusChip(uuid: string): Locator {
        return this.page.getByTestId(`userAccounts-status-chip-${uuid}`);
    }

    editIcon(uuid: string): Locator {
        return this.page.getByTestId(`userAccounts-edit-icon-${uuid}`);
    }

    deleteIcon(uuid: string): Locator {
        return this.page.getByTestId(`userAccounts-delete-icon-${uuid}`);
    }

    // ------------------------
    // Filters / Search
    // ------------------------

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

    statusChipFilter(status: "Active" | "Inactive"): Locator {
        return this.page.getByTestId(
            `userAccounts-statusFilter-chip-${status}`,
        );
    }

    async toggleStatusFilter(status: "Active" | "Inactive") {
        await this.statusChipFilter(status).click();
    }

    institutionChipFilter(institutionModelId: string | number): Locator {
        return this.page.getByTestId(
            `userAccounts-institutionFilter-chip-${institutionModelId}`,
        );
    }

    async toggleInstitutionFilter(institutionModelId: string | number) {
        await this.institutionChipFilter(institutionModelId).click();
    }

    // ------------------------
    // Table interactions
    // ------------------------

    async navigateToCreateUserAccount(): Promise<PlaywrightCreateUserAccountPage> {
        await this.addUserButton.click();
        const createUserAccountPage = new PlaywrightCreateUserAccountPage(
            this.page,
        );
        await createUserAccountPage.expectVisible();
        return createUserAccountPage;
    }

    async clickEditIcon(uuid: string) {
        await this.editIcon(uuid).click();
    }

    async clickDeleteIcon(uuid: string) {
        await this.deleteIcon(uuid).click();
    }

    async clickStatusChip(uuid: string) {
        await this.statusChip(uuid).click();
    }

    // ------------------------
    // Dialog helpers
    // ------------------------

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
        await this.statusConfirmButton.click();
    }

    async cancelStatusChange() {
        await this.statusCancelButton.click();
    }

    // ------------------------
    // Assertions for row state
    // ------------------------

    async expectRowVisible(uuid: string) {
        await expect(this.row(uuid)).toBeVisible();
    }

    async expectStatusText(uuid: string, text: "Active" | "Inactive") {
        await expect(this.statusChip(uuid)).toHaveText(text);
    }

    async expectAnyValidationMessageVisible() {
        await expect(this.anyVuetifyValidationMessage.first()).toBeVisible();
    }

    // ------------------------
    // Sorting + Paging
    // ------------------------

    headerByText(text: string): Locator {
        return this.tableHeadersComponent.getByText(text, { exact: true });
    }

    async sortByHeaderText(text: string) {
        await this.headerByText(text).click();
    }

    paginationRoot(): Locator {
        return this.tableSection.locator(".v-pagination-root");
    }

    async expectPaginationVisible() {
        await expect(this.paginationRoot()).toBeVisible();
    }

    // ------------------------
    // Network assertion helpers
    // ------------------------

    async expectUserAccountsListRequestSucceeded(
        action: () => Promise<void>,
        opts?: {
            expectedStatus?: number;
            urlMustContain?: Array<string | RegExp>;
        },
    ) {
        const expectedStatus = opts?.expectedStatus ?? 200;

        const urlRegex = /\/useraccount\?/i;

        const requestPromise = waitForRequest(this.page, "GET", urlRegex);

        await expectRequestSucceeded({
            page: this.page,
            method: "GET",
            urlRegex,
            action,
            expectedStatus,
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
        uuid: string,
        action: () => Promise<void>,
    ) {
        const urlRegex = new RegExp(`/useraccount/${uuid}(?:$|\\?)`, "i");
        await expectRequestSucceeded({
            page: this.page,
            method: "DELETE",
            urlRegex,
            action,
            expectedStatus: 200,
        });
    }

    async expectDeactivateRequestSucceeded(
        uuid: string,
        action: () => Promise<void>,
    ) {
        const urlRegex = new RegExp(
            `/useraccount/${uuid}/inactive(?:\\?|$)`,
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
        uuid: string,
        action: () => Promise<void>,
    ) {
        const urlRegex = new RegExp(
            `/useraccount/${uuid}/active(?:\\?|$)`,
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
