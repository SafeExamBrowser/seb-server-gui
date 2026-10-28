import { test } from "../fixtures/table-list-fixtures";

const EXAM_TEMPLATE_NAME = "NadimTest5";

const examTemplateCreateNamingValid1 = {
    name: EXAM_TEMPLATE_NAME,
    description: "test",
    examType: "BYOD",
    clientConfiguration: "000-testgetall-connection-configuration-chromium",
    lmsIntegration: true,
    institutionalDefault: true,
    screenProctoringEnabled: true,
};


test.describe("11 Exam Template - Create", () => {
    test.use({ timezoneId: "UTC" });

    test("A create basic exam template", async ({
        examTemplateCreate,
        examTemplate,
    }) => {
        //step 1 - naming
        await examTemplateCreate.goto();

        await examTemplateCreate.expectStepVisible(1);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.fillFormNaming(examTemplateCreateNamingValid1);
        await examTemplateCreate.goToNextStep();

        //step 2 - seb settings
        await examTemplateCreate.expectStepVisible(2);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.goToNextStep();

        //step 3 - exam supervisors
        await examTemplateCreate.expectStepVisible(3);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.expectSupervisorRowVisible("testmain");
        await examTemplateCreate.selectSupervisorRow("testmain");

        await examTemplateCreate.goToNextStep();

        //step 4 - indicators
        await examTemplateCreate.expectStepVisible(4);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.goToNextStep();

        //step 5 - groups
        await examTemplateCreate.expectStepVisible(5);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.goToNextStep();

        //step 6 - overview
        await examTemplateCreate.expectStepVisible(6);
        await examTemplateCreate.expectStepperSaveButtonVisible();

        await examTemplateCreate.saveExamTemplate();

        //successful creation
        await examTemplate.expectExamTemplateTitleVisible(EXAM_TEMPLATE_NAME);
    });
});
