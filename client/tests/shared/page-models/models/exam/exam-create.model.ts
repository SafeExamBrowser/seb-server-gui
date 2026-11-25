import { expect, type Locator, type Page } from "@playwright/test";

import en from "@/i18n/locales/en.json" with { type: "json" };

import { selectVuetifyOptionByName } from "../../../../utils/helpers.ts";

const ROUTE = "/exam/create";
const QUIZ_TABLE = "create-exam-quiz-table";

// "Prepare exam": the wizard that imports an exam from an assessment tool
export class ExamCreateModel {
    readonly page: Page;
    readonly stepperNextButton: Locator;
    readonly stepperSaveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.stepperNextButton = page.getByTestId("stepper-next");
        this.stepperSaveButton = page.getByTestId("stepper-save");
    }

    //----------general----------
    async goto() {
        await this.page.goto(ROUTE);
    }

    // the steps have no test ids, so they are located by their heading
    async expectStepVisible(title: string) {
        await expect(
            this.page.getByRole("heading", { name: title, exact: true }),
        ).toBeVisible();
    }

    async goToNextStep() {
        await this.stepperNextButton.click();
    }

    async importExam() {
        await this.stepperSaveButton.click();
    }

    //-----------assessment tool-------------
    async selectAssessmentTool(name: string) {
        await selectVuetifyOptionByName(
            this.page,
            this.page.getByRole("combobox", {
                name: en.createExam.steps.assessmentTool.fields.tool.label,
            }),
            name,
        );
    }

    //-----------exam (quiz) of the assessment tool-------------
    quizRow(name: string) {
        return this.page
            .getByTestId(QUIZ_TABLE)
            .locator("tbody")
            .getByRole("row")
            .filter({ hasText: name });
    }

    async expectQuizRowCount(count: number) {
        await expect(
            this.page.getByTestId(QUIZ_TABLE).locator("tbody").getByRole("row"),
        ).toHaveCount(count);
    }

    async selectQuiz(name: string) {
        await this.quizRow(name).click();
    }

    //-----------exam template-------------
    async selectExamTemplate(name: string) {
        await this.page
            .getByRole("listitem")
            .filter({ hasText: name })
            .first()
            .click();
    }

    //-----------supervisors-------------
    async selectSupervisor(username: string) {
        await this.page
            .getByRole("button")
            .filter({ hasText: username })
            .first()
            .click();
    }

    //-----------quit password-------------
    async setQuitPassword(password: string) {
        await this.page
            .getByLabel(
                en.createExam.steps.quitPassword.fields.quitPassword.label,
            )
            .fill(password);
    }
}
