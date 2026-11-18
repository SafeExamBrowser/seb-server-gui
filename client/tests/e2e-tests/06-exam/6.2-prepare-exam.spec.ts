import en from "@/i18n/locales/en.json" with { type: "json" };

import { expect, test } from "../fixtures/table-list-fixtures";
import {
    CREATED_EXAM_ID,
    EXAM_TEMPLATES,
    LMS_QUIZZES,
    LMS_SETUPS,
} from "../mocks/mock-data";

const IMPORT_EXAM_URL = /\/api\/exam(?:$|\?)/;

const assessmentTool = LMS_SETUPS[0];
const quiz = LMS_QUIZZES[0];
const examTemplate = EXAM_TEMPLATES[0];
const supervisorUsername = "ljohnson";
const quitPassword = "e2e-quit-password";

test.describe("06 Exam - Prepare exam", () => {
    test.use({ timezoneId: "UTC" });

    test("A imports an exam from an assessment tool", async ({
        examCreate,
        exam,
    }) => {
        await examCreate.goto();

        await test.step("select the assessment tool", async () => {
            await examCreate.expectStepVisible(
                en.createExam.steps.assessmentTool.title,
            );
            await examCreate.selectAssessmentTool(assessmentTool.name);
            await examCreate.goToNextStep();
        });

        await test.step("select the exam of the assessment tool", async () => {
            await examCreate.expectStepVisible(en.createExam.steps.quiz.title);

            //only the exams of the selected assessment tool are offered
            await examCreate.expectQuizRowCount(
                LMS_QUIZZES.filter(
                    (candidate) => candidate.lms_setup_id === assessmentTool.id,
                ).length,
            );

            await examCreate.selectQuiz(quiz.quiz_name);
            await examCreate.goToNextStep();
        });

        await test.step("select the exam template", async () => {
            await examCreate.expectStepVisible(
                en.createExam.steps.examTemplate.title,
            );
            await examCreate.selectExamTemplate(examTemplate.name);
            await examCreate.goToNextStep();
        });

        await test.step("select a supervisor", async () => {
            await examCreate.expectStepVisible(
                en.createExam.steps.supervisors.title,
            );
            await examCreate.selectSupervisor(supervisorUsername);
            await examCreate.goToNextStep();
        });

        await test.step("set the quit password", async () => {
            await examCreate.expectStepVisible(
                en.createExam.steps.quitPassword.title,
            );
            await examCreate.setQuitPassword(quitPassword);
            await examCreate.goToNextStep();
        });

        await test.step("import the exam", async () => {
            await examCreate.expectStepVisible(
                en.createExam.steps.summary.title,
            );

            const importRequest = examCreate.page.waitForRequest(
                (request) =>
                    IMPORT_EXAM_URL.test(request.url()) &&
                    request.method() === "POST",
            );
            await examCreate.importExam();

            //the wizard sends the selected exam, template and quit password
            const body = new URLSearchParams(
                (await importRequest).postData() ?? "",
            );
            expect(body.get("quiz_id")).toBe(quiz.quiz_id);
            expect(body.get("lms_setup_id")).toBe(String(quiz.lms_setup_id));
            expect(body.get("examTemplateId")).toBe(String(examTemplate.id));
            expect(body.get("quitPassword")).toBe(quitPassword);
        });

        await test.step("detail page shows the imported exam", async () => {
            await expect(exam.page).toHaveURL(
                new RegExp(`/exam/${CREATED_EXAM_ID}$`),
            );

            //reload, so the page shows what the backend stored and not what is left in the wizard state
            await exam.page.reload();
            await exam.expectExamTitleVisible(quiz.quiz_name);
        });
    });
});
