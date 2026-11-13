import { expect, type Locator, type Page } from "@playwright/test";

import en from "@/i18n/locales/en.json" with { type: "json" };

import { selectVuetifyOptionByName } from "../../../../utils/helpers.ts";
import {
    type FormFieldSpec,
    FormPageModel,
} from "../../generic-models/form-page.model.ts";


const ROUTE = "/exam-template/create";
const PREFIX = "";

const STEP1_NAMING_FORM = "exam-template-step1";
const STEP2_SEB_SETTINGS = "exam-template-step2";
const STEP3_SUPERVISORS_TABLE = "exam-template-step3";
const STEP4_INDICATORS_TABLE = "exam-template-step4";
const STEP5_GROUPS_TABLE = "exam-template-step5";
const STEP6_SUMMARY = "exam-template-step6";


const fields: FormFieldSpec[] = [
    { name: "name", type: "text", formTestId: STEP1_NAMING_FORM },
    { name: "description", type: "text", formTestId: STEP1_NAMING_FORM },
    { name: "examType", type: "select", formTestId: STEP1_NAMING_FORM },
    { name: "clientConfiguration", type: "select", formTestId: STEP1_NAMING_FORM },
    { name: "lmsIntegration", type: "switch", formTestId: STEP1_NAMING_FORM },
    { name: "institutionalDefault", type: "switch", formTestId: STEP1_NAMING_FORM },
    { name: "screenProctoringEnabled", type: "switch", formTestId: STEP1_NAMING_FORM },
];

export type ExamTemplateNamingInput = {
    name: string;
    description: string;
    examType: string;
    clientConfiguration: string;
    lmsIntegration: boolean;
    institutionalDefault: boolean;
    screenProctoringEnabled: boolean;
};

export type ExamTemplateIPRangeGroupInput = {
    name: string;
    ipRangeStart: string;
    ipRangeEnd: string;
};

export type ExamTemplateClientOSGroupInput = {
    name: string;
    clientOS: string;
};

export class ExamTemplateCreateModel extends FormPageModel {
    readonly stepperPreviousButton: Locator;
    readonly stepperNextButton: Locator;
    readonly stepperSaveButton: Locator;

    constructor(page: Page) {
        super(page, {
            route: ROUTE,
            testPrefix: PREFIX,
            fields,
        });

        this.stepperPreviousButton = page.getByTestId("stepper-previous");
        this.stepperNextButton = page.getByTestId("stepper-next");
        this.stepperSaveButton = page.getByTestId("stepper-save");
    }

    //----------general----------
    async goto() {
        await this.page.goto("/exam-template/create");
    }

    async expectStepVisible(step: number) {
        await expect(
            this.page.getByTestId("exam-template-step" + step),
        ).toBeVisible();
    }

    async expectStepperNextButtonVisible() {
        await expect(this.stepperNextButton).toBeVisible();
    }

    async expectStepperPreviousButtonVisible() {
        await expect(this.stepperPreviousButton).toBeVisible();
    }

    async expectStepperSaveButtonVisible() {
        await expect(this.stepperSaveButton).toBeVisible();
    }

    async goToNextStep() {
        await this.stepperNextButton.click();
    }

    async goToPreviousStep() {
        await this.stepperPreviousButton.click();
    }

    async saveExamTemplate() {
        await this.stepperSaveButton.click();
    }

    async expectExamTemplateVisible() {
        await expect(
            this.page.getByTestId("exam-template-title)"),
        ).toBeVisible();
    }

    //-----------step 1 - naming-------------
    async fillFormNaming(input: ExamTemplateNamingInput) {
        await this.fill({
            ["name"]: input.name,
            ["description"]: input.description,
            ["examType"]: input.examType,
            ["clientConfiguration"]: input.clientConfiguration,
        });

        // switches are off by default and set() toggles them, so only touch the enabled ones
        const switches = {
            ["lmsIntegration"]: input.lmsIntegration,
            ["institutionalDefault"]: input.institutionalDefault,
            ["screenProctoringEnabled"]: input.screenProctoringEnabled,
        };
        for (const [name, enabled] of Object.entries(switches)) {
            if (enabled) {
                await this.field(name).set("on");
            }
        }
    }

    //-----------step 2 - seb settings-------------
    async openSEBSettingsTab(tabName: string) {
        await this.page
            .getByTestId(STEP2_SEB_SETTINGS)
            .getByRole("tab", { name: tabName })
            .click();
    }

    async setSEBSettingCheckbox(label: string, checked: boolean) {
        const checkbox = this.page
            .getByTestId(STEP2_SEB_SETTINGS)
            .getByRole("checkbox", { name: label, exact: true });
        await checkbox.setChecked(checked);
        await expect(checkbox).toBeChecked({ checked });
    }

    //-----------step 3 - exam supervisors-------------
    async expectSupervisorRowVisible(username: string) {
        const supervisorRow = this.page.getByRole("row", { name: username });
        await expect(supervisorRow).toBeVisible();
    }

    async selectSupervisorRow(username: string) {
        const supervisorRow = this.page.getByRole("row", { name: username });
        await supervisorRow.click();
    }

    //-----------step 4 - indicators-------------
    async addIndicator(name: string, type: string) {
        await this.page
            .getByTestId(STEP4_INDICATORS_TABLE)
            .getByRole("button", { name: en.indicators.addDialogTitle })
            .click();

        const dialog = this.page.getByRole("dialog", {
            name: en.indicators.addDialogTitle,
        });
        await expect(dialog).toBeVisible();

        await this.fillDialogName(
            dialog,
            en.indicators.fields.name.label,
            name,
        );
        // choosing a type pre-fills the default thresholds
        await selectVuetifyOptionByName(
            this.page,
            dialog.getByRole("combobox", {
                name: en.indicators.fields.type.label,
            }),
            type,
        );

        await dialog
            .getByRole("button", { name: en.general.createButton })
            .click();
        await expect(dialog).toBeHidden();
    }

    async expectIndicatorRowVisible(name: string, type: string) {
        const row = this.tableRow(STEP4_INDICATORS_TABLE, name);
        await expect(row).toBeVisible();
        await expect(row).toContainText(type);
    }

    //-----------step 5 - groups-------------
    private async openAddGroupDialog(name: string, type: string) {
        await this.page
            .getByTestId(STEP5_GROUPS_TABLE)
            .getByRole("button", { name: en.clientGroups.addDialogTitle })
            .click();

        const dialog = this.page.getByRole("dialog", {
            name: en.clientGroups.addDialogTitle,
        });
        await expect(dialog).toBeVisible();

        await this.fillDialogName(
            dialog,
            en.clientGroups.fields.name.label,
            name,
        );
        await selectVuetifyOptionByName(
            this.page,
            dialog.getByRole("combobox", {
                name: en.clientGroups.fields.type.label,
            }),
            type,
        );

        return dialog;
    }

    async addIPRangeGroup(group: ExamTemplateIPRangeGroupInput) {
        const dialog = await this.openAddGroupDialog(
            group.name,
            en.clientGroups.fields.type.types.IP_V4_RANGE,
        );

        await dialog
            .getByLabel(en.clientGroups.fields.ipRangeStart.label)
            .fill(group.ipRangeStart);
        await dialog
            .getByLabel(en.clientGroups.fields.ipRangeEnd.label)
            .fill(group.ipRangeEnd);

        await this.submitGroupDialog(dialog);
    }

    async addClientOSGroup(group: ExamTemplateClientOSGroupInput) {
        const dialog = await this.openAddGroupDialog(
            group.name,
            en.clientGroups.fields.type.types.CLIENT_OS,
        );

        await selectVuetifyOptionByName(
            this.page,
            dialog.getByRole("combobox", {
                name: en.clientGroups.fields.clientOS.label,
            }),
            group.clientOS,
        );

        await this.submitGroupDialog(dialog);
    }

    async expectGroupRowVisible(name: string) {
        await expect(this.tableRow(STEP5_GROUPS_TABLE, name)).toBeVisible();
    }

    //-----------step 6 - overview-------------
    async expectSummaryContains(texts: string[]) {
        const summary = this.page.getByTestId(STEP6_SUMMARY);
        for (const text of texts) {
            await expect(summary).toContainText(text);
        }
    }

    //only body rows, the header row can contain the same text
    private tableRow(tableTestId: string, text: string) {
        return this.page
            .getByTestId(tableTestId)
            .locator("tbody")
            .getByRole("row")
            .filter({ hasText: text });
    }

    private async submitGroupDialog(dialog: Locator) {
        await dialog
            .getByRole("button", { name: en.general.createButton })
            .click();
        await expect(dialog).toBeHidden();
    }

    // the regular click waits until the dialog's open transition has settled; otherwise
    // the force click of the select helper that follows can hit the scrim and close the dialog
    private async fillDialogName(dialog: Locator, label: string, name: string) {
        const nameField = dialog.getByLabel(label);
        await nameField.click();
        await nameField.fill(name);
    }
}
