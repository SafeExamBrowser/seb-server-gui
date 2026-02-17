import express, {Router} from "express";

import * as systemController from "../controllers/seb-server/system.controller";
import * as examController from "../controllers/seb-server/exam.controller";
import * as screenProctoringController from "../controllers/seb-server/screen-proctoring.controller";
import * as indicatorController from "../controllers/seb-server/indicator.controller";
import * as monitoringController from "../controllers/seb-server/monitoring.controller";
import * as clientGroupsController from "../controllers/seb-server/client-groups.controller";
import * as constants from "../utils/constants";

//screen-proctoring
import * as groupController from "../controllers/screen-proctoring/sp-group.controller";
import * as screenshotDataController from "../controllers/screen-proctoring/sp-screenshot-data.controller";
import * as searchController from "../controllers/screen-proctoring/sp-search.controller";
import * as settingsController from "../controllers/screen-proctoring/sp-settings.controller";
import * as applicationSearchController from "../controllers/screen-proctoring/sp-application-search.controller";
import * as institutionsController from "../controllers/seb-server/institution.controller";
import * as clientConnectionController from "../controllers/seb-server/client-connection.controller";

const router: Router = express.Router();

// system
router.get(constants.SYSTEM_FEATURE_ROUTE, systemController.getSystemFeatures)

//exams 
router.get(constants.EXAMS_ROUTE, examController.getExams);
router.delete(constants.EXAM_ROUTE + "/:id", examController.deleteExam);
router.put(constants.EXAM_ROUTE + "/:id", examController.updateExam);
router.patch(constants.EXAM_ARCHIVE_ROUTE, examController.archiveExam)
router.get(constants.EXAM_ROUTE + "/:id" + constants.KEY_INFO_ROUTE, examController.getExamAppSignatureKeys);
router.post(constants.EXAM_ROUTE + "/:parentId" + constants.GRANT_ROUTE + "/:id", examController.grantExamAppSignatureKey);
router.delete(constants.EXAM_ROUTE + "/:parentId" + constants.GRANT_ROUTE + "/:id", examController.removeGrantExamAppSignatureKey);
router.get(constants.EXAM_ROUTE + "/:id" + constants.GRANT_ROUTE, examController.getGrantedExamAppSignatureKeys);


router.get(constants.EXAM_CONFIGURATION_MAP_ROUTE + "/:id", examController.getExamConfigurationMap);
router.get(constants.EXAMS_ROUTE + "/monitoring", examController.getExamsForMonitoring);

// SEB lock
router.put(constants.EXAM_ROUTE + "/:id" + "/apply-seb-restriction", examController.putSEBLock);
router.delete(constants.EXAM_ROUTE + "/:id" + "/apply-seb-restriction", examController.deleteSEBLock);
router.get(constants.EXAM_ROUTE + "/:id" + "/check-seb-restriction", examController.checkSEBLock)

//screen proctoring
router.post(constants.EXAM_SCREEN_PROCTORING_ROUTE, screenProctoringController.saveScreenProctoringSettings);
router.post(constants.EXAM_SCREEN_PROCTORING_ROUTE + "/apply-groups", screenProctoringController.applyScreenProctoringGroups);
router.post(constants.EXAM_SCREEN_PROCTORING_ROUTE + "/activation", screenProctoringController.activateScreenProctoring);

//institutions
router.get(constants.INSTITUTION_ROUTE, institutionsController.getInstitutions);
router.get(constants.INSTITUTION_ROUTE, institutionsController.getInstitutions);
router.get(constants.ADMIN_INSTITUTION_LOGO_ROUTE + "/:suffix", institutionsController.getInstitutionLogo)

//monitoring
router.post(constants.MONITORING_TEST_RUN_ROUTE + "/:id", monitoringController.applyTestRun);
router.get(constants.MONITORING_OVERVIEW_ROUTE + "/:id", monitoringController.getOverview);
router.get(constants.MONITORING_CONNECTIONS_ROUTE + "/:id", monitoringController.getConnections);
router.get(constants.MONITORING_GET_ROUTE + "/:id/:connectionToken", monitoringController.getSingleConnection);
router.post(constants.MONITORING_ROUTE + "/:id/static-client-data", monitoringController.getStaticClientData);
router.post(constants.MONITORING_INSTRUCTION_ROUTE, monitoringController.registerInstruction);
router.post(constants.MONITORING_QUIT_ALL_ROUTE, monitoringController.quitAll);
router.get(constants.MONITORING_NOTIFICATIONS_ROUTE + "/:connectionToken", monitoringController.getPendingNotifications);
router.post(constants.MONITORING_NOTIFICATIONS_ROUTE + "/:notificationId/:connectionToken", monitoringController.confirmNotification);
router.post(constants.MONITORING_DISABLE_CONNECTIONS_ROUTE, monitoringController.disableConnections);
router.get(constants.MONITORING_LOGS_ROUTE + "/:id" , monitoringController.getClientEventLogs);

//client groups
router.get(constants.CLIENT_GROUP_ROUTE + "/:id", clientGroupsController.getClientGroup);
router.get(constants.CLIENT_GROUP_ROUTE, clientGroupsController.getClientGroups);
router.post(constants.CLIENT_GROUP_ROUTE, clientGroupsController.createClientGroup);
router.put(constants.CLIENT_GROUP_ROUTE, clientGroupsController.updateClientGroup);
router.delete(constants.CLIENT_GROUP_ROUTE + "/:id", clientGroupsController.deleteClientGroup);

//client connection
router.get(constants.CLIENT_CONNECTION_ROUTE + "/list", clientConnectionController.getClientConnectionList)

//indicator
router.get(constants.INDICATOR_ROUTE, indicatorController.getIndicators);

//screen-proctoring
router.get("/sp/settings", settingsController.getSettings)

router.get("/sp/group", groupController.getGroups);
router.get("/sp/group/:uuid", groupController.getGroupByUuid);

router.get("/sp/screenshot-data/:sessionId", screenshotDataController.getScreenshotDataBySessionId);
router.get("/sp/screenshot-data/:sessionId/:timestamp", screenshotDataController.getScreenshotDataByTimestamp);
router.get("/sp/screenshot-timestamps/:sessionId/:timestamp/:direction", screenshotDataController.getScreenshotTimestamps);

router.get("/sp/search/sessions/day", searchController.searchSessionsDay);
router.get("/sp/search/sessions", searchController.searchSessions);
router.get("/sp/search/screenshots", searchController.searchScreenshots);
router.get("/sp/search/timeline/:sessionId", searchController.searchTimeline);
router.delete("/sp/search/sessions/delete", searchController.deleteSessions)

router.get("/sp/search/applications/exams", applicationSearchController.getExamsStarted);
router.get("/sp/search/applications/groupIds/:examId", applicationSearchController.getGroupIdsForExam);
router.get("/sp/search/applications/metadata/app", applicationSearchController.getDistinctMetadataAppForExam);
router.get("/sp/search/applications/metadata/window", applicationSearchController.getDistinctMetadataWindowForExam);
router.get("/sp/search/applications/users", applicationSearchController.getUserListForApplicationSearch);
router.get("/sp/search/applications/timestamps", applicationSearchController.getTimestampListForApplicationSearch);

export default router;