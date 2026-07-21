import { expect, type Locator, type Page } from "@playwright/test";

import { selectVuetifyOptionByName } from "../../../utils/helpers";

export class EntityTableModel {
    readonly page: Page;
    readonly testIdBase: string;
    readonly root: Locator;
    readonly pagination: Locator;
    readonly itemsPerPage: Locator;

    constructor(page: Page, testIdBase: string) {
        this.page = page;
        this.testIdBase = testIdBase;
        this.root = page.getByTestId(`${testIdBase}-table`);
        this.pagination = page.getByTestId(`${testIdBase}-pagination`);
        this.itemsPerPage = page.getByTestId(`${testIdBase}-items-per-page`);
    }

    async expectVisible() {
        await expect(this.root).toBeVisible();
    }

    row(id: string | number): Locator {
        return this.page.getByTestId(`${this.testIdBase}-row-${id}`);
    }

    cell(id: string | number, columnKey: string): Locator {
        return this.page.getByTestId(
            `${this.testIdBase}-row-${id}-cell-${columnKey}`,
        );
    }

    statusChip(id: string | number): Locator {
        return this.page.getByTestId(
            `${this.testIdBase}-row-${id}-status-chip`,
        );
    }

    rowAction(id: string | number, actionKey: string): Locator {
        return this.page.getByTestId(
            `${this.testIdBase}-row-${id}-${actionKey}-button`,
        );
    }

    editButton(id: string | number): Locator {
        return this.rowAction(id, "edit");
    }

    deleteButton(id: string | number): Locator {
        return this.rowAction(id, "delete");
    }

    header(columnKey: string): Locator {
        return this.page.getByTestId(`${this.testIdBase}-header-${columnKey}`);
    }

    async sortByColumn(columnKey: string) {
        await this.header(columnKey).click();
    }

    pageButton(pageNumber: number): Locator {
        return this.pagination.getByRole("button", {
            name: new RegExp(
                `^(?:Go to page|Page)\\s+${pageNumber}(?:,|$)`,
                "i",
            ),
        });
    }

    async goToPage(pageNumber: number) {
        await this.pageButton(pageNumber).first().click();
    }

    async setItemsPerPage(value: number) {
        await selectVuetifyOptionByName(
            this.page,
            this.itemsPerPage,
            String(value),
        );
    }

    async hasPage(pageNumber: number): Promise<boolean> {
        return (await this.pageButton(pageNumber).count()) > 0;
    }

    async expectRowVisible(id: string | number) {
        await expect(this.row(id)).toBeVisible();
    }

    async expectRowAbsent(id: string | number) {
        await expect(this.row(id)).toHaveCount(0);
    }

    async expectStatusText(id: string | number, text: "Active" | "Inactive") {
        await expect(this.statusChip(id)).toHaveText(text);
    }
}
