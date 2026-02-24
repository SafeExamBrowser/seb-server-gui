import express, {Router} from "express";

//screen-proctoring
import * as groupController from "../controllers/screen-proctoring/sp-group.controller";
import * as settingsController from "../controllers/screen-proctoring/sp-settings.controller";

const router: Router = express.Router();

//screen-proctoring
router.get("/sp/settings", settingsController.getSettings)

router.get("/sp/group", groupController.getGroups);
router.get("/sp/group/:uuid", groupController.getGroupByUuid);

export default router;