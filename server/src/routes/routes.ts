import express, {Router} from "express";

//screen-proctoring
import * as groupController from "../controllers/screen-proctoring/sp-group.controller";
import * as screenshotDataController from "../controllers/screen-proctoring/sp-screenshot-data.controller";
import * as searchController from "../controllers/screen-proctoring/sp-search.controller";
import * as settingsController from "../controllers/screen-proctoring/sp-settings.controller";

const router: Router = express.Router();

//screen-proctoring
router.get("/sp/settings", settingsController.getSettings)

router.get("/sp/group", groupController.getGroups);
router.get("/sp/group/:uuid", groupController.getGroupByUuid);

router.get("/sp/screenshot-data/:sessionId", screenshotDataController.getScreenshotDataBySessionId);
router.get("/sp/screenshot-data/:sessionId/:timestamp", screenshotDataController.getScreenshotDataByTimestamp);
router.get("/sp/screenshot-timestamps/:sessionId/:timestamp/:direction", screenshotDataController.getScreenshotTimestamps);

router.get("/sp/search/timeline/:sessionId", searchController.searchTimeline);
router.delete("/sp/search/sessions/delete", searchController.deleteSessions)

export default router;