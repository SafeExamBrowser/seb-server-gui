import express, {Router} from "express";
import * as quizController from "../controllers/quiz.controller";
import * as examController from "../controllers/exam.controller";
import * as examTemplateController from "../controllers/exam-template.controller";
import * as constants from "../utils/constants";

const router: Router = express.Router();

//quiz
router.get(constants.QUIZ_ROUTE, quizController.getQuizzes);

//exams
router.get(constants.EXAM_ROUTE, examController.getExams);
router.get(constants.EXAM_CONFIGURATION_MAP_ROUTE + "/:id", examController.getExamConfigurationMap);

//exam template
router.get(constants.EXAM_TEMPLATE_ROUTE, examTemplateController.getExamTemplates)


export default router;