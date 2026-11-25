import { expect, type Locator } from "@playwright/test";

import en from "@/i18n/locales/en.json" with { type: "json" };

import { BasicPageModel } from "./basic-page.model.ts";

// Detail pages (exam, exam template, ...) show their data in boxes with key-value lists and tables.
export class DetailPageModel extends BasicPageModel {
    // A key-value row is `<div><b>label</b><span>value</span></div>`.
    basicSettingValue(label: string) {
        return this.page
            .locator("b", { hasText: new RegExp(`^\\s*${label}\\s*$`) })
            .locator("xpath=following-sibling::span");
    }

    async expectBasicSettingText(label: string, value: string) {
        await expect(this.basicSettingValue(label)).toHaveText(value);
    }

    async expectBasicSettingFlag(label: string, enabled: boolean) {
        await expect(
            this.basicSettingValue(label).getByRole("img", {
                name: enabled ? en.general.true : en.general.false,
            }),
        ).toBeVisible();
    }

    // the boxes have no test ids, so they are located by their heading
    box(title: string) {
        return this.page
            .locator(".v-card")
            .filter({ has: this.page.getByRole("heading", { name: title }) });
    }

    //only body rows, the header row can contain the same text (e.g. "Screen Proctoring")
    tableRow(table: Locator, text: string) {
        return table
            .locator("tbody")
            .getByRole("row")
            .filter({ hasText: text });
    }

    async expectSupervisorRowVisible(username: string, fullName: string) {
        const row = this.tableRow(this.box(en.boxSupervisors.title), username);
        await expect(row).toBeVisible();
        await expect(row).toContainText(fullName);
    }
}
