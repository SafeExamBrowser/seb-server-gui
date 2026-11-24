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

test.describe("03 Exam Template - Start", () => {
    test.use({ timezoneId: "UTC" });

    test("A create basic exam template", async ({
        examTemplateCreate,
        examTemplate,
    }) => {
        await test.step("step 1 - naming", async () => {
            await examTemplateCreate.goto();

            await examTemplateCreate.expectStepVisible(1);
            await examTemplateCreate.expectStepperNextButtonVisible();

            await examTemplateCreate.fillFormNaming(
                examTemplateCreateNamingValid1,
            );
            await examTemplateCreate.goToNextStep();
        });

        await test.step("step 2 - seb settings", async () => {
            await examTemplateCreate.expectStepVisible(2);
            await examTemplateCreate.expectStepperNextButtonVisible();

            await examTemplateCreate.goToNextStep();
        });

        await test.step("step 3 - exam supervisors", async () => {
            await examTemplateCreate.expectStepVisible(3);
            await examTemplateCreate.expectStepperNextButtonVisible();

            await examTemplateCreate.expectSupervisorRowVisible("testmain");
            await examTemplateCreate.selectSupervisorRow("testmain");

            await examTemplateCreate.goToNextStep();
        });

        await test.step("step 4 - indicators", async () => {
            await examTemplateCreate.expectStepVisible(4);
            await examTemplateCreate.expectStepperNextButtonVisible();

            await examTemplateCreate.goToNextStep();
        });

        await test.step("step 5 - groups", async () => {
            await examTemplateCreate.expectStepVisible(5);
            await examTemplateCreate.expectStepperNextButtonVisible();

            await examTemplateCreate.goToNextStep();
        });

        await test.step("step 6 - overview", async () => {
            await examTemplateCreate.expectStepVisible(6);
            await examTemplateCreate.expectStepperSaveButtonVisible();

            await examTemplateCreate.saveExamTemplate();
        });

        await test.step("successful creation", async () => {
            await examTemplate.expectExamTemplateTitleVisible(
                EXAM_TEMPLATE_NAME,
            );
        });
    });
});
