import { expect, type Locator, type Page } from "@playwright/test";

import en from "@/i18n/locales/en.json" with { type: "json" };

import { BasicPageModel } from "../../generic-models/basic-page.model.ts";
import { ErrorStateModel } from "../../widgets/error-state.model.ts";
import type { ExamTemplateNamingInput } from "./exam-template-create.model.ts";

const ROUTE = "/exam-template/:id";
const PREFIX = "examTemplateDetail";
const PAGE_TEST_ID = "exam-template-detail-page";

export class ExamTemplateModel extends BasicPageModel {
    readonly errorState: ErrorStateModel;
    readonly breadCrumb: Locator;

    constructor(page: Page) {
        super(page, {
            route: ROUTE,
            testPrefix: PREFIX,
            pageTestId: PAGE_TEST_ID,
        });
        this.errorState = new ErrorStateModel(page);
        this.breadCrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    }

    // goto() waits for the page title, which is not rendered on the 404 / error pages
    async gotoWithoutWaiting(id: number | string) {
        await this.page.goto(this.url(id));
    }

    async expectExamTemplateTitleVisible(title: string) {
        await this.expectTitle(title);
    }

    //----------------seb settings--------------
    async expectSEBSettingsLastModifiedBy(userName: string) {
        await expect(
            this.page.getByText(
                en.examTemplateDetail.boxes.sebSettings.modifiedby,
            ),
        ).toBeVisible();
        await expect(this.page.getByText(userName)).toBeVisible();
    }

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

    async expectBasicSettings(expected: ExamTemplateNamingInput) {
        await this.expectBasicSettingText(
            en.examTemplate.fields.name.label,
            expected.name,
        );
        await this.expectBasicSettingText(
            en.examTemplate.fields.description.label,
            expected.description,
        );
        await this.expectBasicSettingText(
            en.examTemplate.fields.examType.label,
            expected.examType,
        );
        await this.expectBasicSettingText(
            en.examTemplate.fields.clientConfiguration.label,
            expected.clientConfiguration,
        );
        await this.expectBasicSettingFlag(
            en.examTemplate.fields.lmsIntegration.label,
            expected.lmsIntegration,
        );
        await this.expectBasicSettingFlag(
            en.examTemplate.fields.institutionalDefault.label,
            expected.institutionalDefault,
        );
        await this.expectBasicSettingFlag(
            en.screenProctoring.enabled.label,
            expected.screenProctoringEnabled,
        );
    }

    async expectSEBSettingsLastModified(value: string) {
        await expect(
            this.basicSettingValue(
                en.examTemplateDetail.boxes.sebSettings.modifiedby,
            ),
        ).toHaveText(value);
    }

    async openBasicSettingsEditDialog() {
        await this.page
            .getByRole("button", {
                name: en.examTemplateDetail.boxes.basicSettings.dialogTitle,
            })
            .click();
        const dialog = this.page.getByRole("dialog", {
            name: en.examTemplateDetail.boxes.basicSettings.dialogTitle,
        });
        await expect(dialog).toBeVisible();
        return dialog;
    }

    //------------indicators-------------
    async expectIndicatorRowVisible(
        name: string,
        type: string,
        thresholds: string[],
    ) {
        const row = this.tableRow(
            this.crudTable(en.indicators.entityNamePlural),
            name,
        );

        await expect(row).toBeVisible();
        await expect(row).toContainText(type);

        for (const threshold of thresholds) {
            await expect(row).toContainText(threshold);
        }
    }

    //------------supervisors-------------
    async expectSupervisorRowVisible(username: string, fullName: string) {
        const row = this.tableRow(this.box(en.boxSupervisors.title), username);
        await expect(row).toBeVisible();
        await expect(row).toContainText(fullName);
    }

    async expectClientGroupRowVisible(name: string, type: string) {
        const row = this.tableRow(
            this.crudTable(en.clientGroups.entityNamePlural),
            name,
        );
        await expect(row).toBeVisible();
        await expect(row).toContainText(type);
    }

    //---------client groups---------
    async expectClientGroupRowCount(count: number) {
        await expect(
            this.crudTable(en.clientGroups.entityNamePlural)
                .locator("tbody")
                .getByRole("row"),
        ).toHaveCount(count);
    }

    //---------connection configuration---------
    async expectConnectionConfiguration(name: string) {
        await expect(this.page.getByText(name)).toBeVisible();
    }

    //---------------basic ui elements------
    // the boxes have no test ids, so they are located by their heading
    box(title: string) {
        return this.page
            .locator(".v-card")
            .filter({ has: this.page.getByRole("heading", { name: title }) });
    }

    // the crud tables (indicators, groups) render their title inside the table
    crudTable(title: string) {
        return this.page
            .locator(".v-data-table")
            .filter({ has: this.page.getByRole("heading", { name: title }) });
    }

    //only body rows, the header row can contain the same text (e.g. "Screen Proctoring")
    tableRow(table: Locator, text: string) {
        return table
            .locator("tbody")
            .getByRole("row")
            .filter({ hasText: text });
    }

    async clickBreadCrumb(label: string) {
        await this.breadCrumb.getByRole("link", { name: label }).click();
    }
}
