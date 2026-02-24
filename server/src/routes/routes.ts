import express, {Router} from "express";

//screen-proctoring
import * as groupController from "../controllers/screen-proctoring/sp-group.controller";

const router: Router = express.Router();

//screen-proctoring
router.get("/sp/group/:uuid", groupController.getGroupByUuid);

export default router;