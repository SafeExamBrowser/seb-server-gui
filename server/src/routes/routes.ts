import express, {Router} from "express";
import * as quizController from "../controllers/quiz.controller";
import * as examController from "../controllers/exam.controller";
import * as configurationController from "../controllers/configuration.controller";
import * as examTemplateController from "../controllers/exam-template.controller";
import * as screenProctoringController from "../controllers/screen-proctoring.controller";
import * as userAccountController from "../controllers/user-account.controller";
import * as assessmentToolController from "../controllers/assessment-tool.controller";
import * as monitoringController from "../controllers/monitoring.controller";
import * as clientGroupsController from "../controllers/client-groups.controller";
import * as constants from "../utils/constants";

const router: Router = express.Router();

//quiz
router.get(constants.QUIZ_ROUTE, quizController.getQuizzes);

//exams 
router.get(constants.EXAMS_ROUTE, examController.getExams);

router.post(constants.EXAM_ROUTE, examController.createExam);
router.delete(constants.EXAM_ROUTE + "/:id", examController.deleteExam);
router.put(constants.EXAM_ROUTE + "/:id", examController.updateExam);
router.patch(constants.EXAM_ARCHIVE_ROUTE, examController.archiveExam)
router.get(constants.EXAM_GET_ROUTE + "/:id", examController.getExam);

router.get(constants.EXAM_CONFIGURATION_MAP_ROUTE + "/:id", examController.getExamConfigurationMap);

//screen proctoring
router.post(constants.EXAM_SCREEN_PROCTORING_ROUTE, screenProctoringController.saveScreenProctoringSettings);

//exam template
router.get(constants.EXAM_TEMPLATE_ROUTE + "/:id", examTemplateController.getExamTemplate);
router.get(constants.EXAM_TEMPLATE_ROUTE, examTemplateController.getExamTemplates);

//user accounts
router.get(constants.USER_ACCOUNT_ROUTE + "/:id", userAccountController.getUserAccount);
router.get(constants.USER_ACCOUNT_NAMES_ROUTE, userAccountController.getUserAccountNames);

//connection configurations
router.get(constants.DOWNLOAD_EXAM_CONFIG_ROUTE + "/:id", configurationController.downloadExamConfig);
router.get(constants.CONNECTION_CONFIG_ROUTE, configurationController.getConnectionConfigurations);

//assessment tool
router.get(constants.ASSESSMENT_TOOL_ROUTE, assessmentToolController.getAssessmentTools);

//monitoring
router.post(constants.MONITORING_TEST_RUN_ROUTE + "/:id", monitoringController.applyTestRun);

//client groups
router.get(constants.CLIENT_GROUP_ROUTE, clientGroupsController.getClientGroups);




export default router;