import express, {Router} from "express";
import * as quizController from "../controllers/quiz.controller";
import * as examController from "../controllers/exam.controller";
import * as examTemplateController from "../controllers/exam-template.controller";
import * as userAccountController from "../controllers/user-account.controller";
import * as constants from "../utils/constants";

const router: Router = express.Router();

//quiz
router.get(constants.QUIZ_ROUTE, quizController.getQuizzes);

//exams 
router.get(constants.EXAM_ROUTE, examController.getExams);
router.post(constants.EXAM_ROUTE, examController.createExam);
router.get(constants.EXAM_CONFIGURATION_MAP_ROUTE + "/:id", examController.getExamConfigurationMap);

//exam template
router.get(constants.EXAM_TEMPLATE_ROUTE, examTemplateController.getExamTemplates);

//user accounts
router.get(constants.USER_ACCOUNT_NAMES_ROUTE, userAccountController.getUserAccountNames);



export default router;