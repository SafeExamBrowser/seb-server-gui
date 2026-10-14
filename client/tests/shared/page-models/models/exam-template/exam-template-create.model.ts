import { expect, type Locator, type Page } from "@playwright/test";
import {
    type FormFieldSpec,
    FormPageModel,
} from "../../generic-models/form-page.model.ts";


const ROUTE = "/exam-template/create";
const PREFIX = "";

const STEP1_NAMING_FORM = "exam-template-step1";
const STEP3_SUPERVISORS_TABLE = "exam-template-step3";


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

    //-----------step 1 - naming-------------
    async fillFormNaming(input: ExamTemplateNamingInput) {
        await this.fill({
            ["name"]: input.name,
            ["description"]: input.description,
            ["examType"]: input.examType,
            ["clientConfiguration"]: input.clientConfiguration,
            ["lmsIntegration"]: input.lmsIntegration.toString(),
            ["institutionalDefault"]: input.institutionalDefault.toString(),
            ["screenProctoringEnabled"]:
                input.screenProctoringEnabled.toString(),
        });
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
}
