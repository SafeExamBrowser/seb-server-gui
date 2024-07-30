import express, {Router} from "express";
import * as quizController from "../controllers/quiz.controller";
import * as examController from "../controllers/exam.controller";
import * as constants from "../utils/constants";


const router: Router = express.Router();

router.get(constants.QUIZ_ROUTE, quizController.getQuizzes);



router.get(constants.EXAM_ROUTE, examController.getExams);
router.get(constants.EXAM_CONFIGURATION_MAP_ROUTE + "/:id", examController.getExamConfigurationMap)


export default router;