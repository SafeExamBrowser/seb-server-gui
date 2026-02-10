import express, {Router} from "express";

import * as systemController from "../controllers/seb-server/system.controller";
import * as quizController from "../controllers/seb-server/quiz.controller";
import * as examController from "../controllers/seb-server/exam.controller";
import * as configurationController from "../controllers/seb-server/configuration.controller";
import * as screenProctoringController from "../controllers/seb-server/screen-proctoring.controller";
import * as indicatorController from "../controllers/seb-server/indicator.controller";
import * as userAccountController from "../controllers/seb-server/user-account.controller";
import * as assessmentToolController from "../controllers/seb-server/assessment-tool.controller";
import * as monitoringController from "../controllers/seb-server/monitoring.controller";
import * as clientGroupsController from "../controllers/seb-server/client-groups.controller";
import * as constants from "../utils/constants";
import * as examSEBSettingsController from "../controllers/seb-server/exam-sebsettings.controller";
import * as templateSEBSettingsController from "../controllers/seb-server/template-sebsettings.controller";

//screen-proctoring
import * as groupController from "../controllers/screen-proctoring/sp-group.controller";
import * as screenshotDataController from "../controllers/screen-proctoring/sp-screenshot-data.controller";
import * as searchController from "../controllers/screen-proctoring/sp-search.controller";
import * as settingsController from "../controllers/screen-proctoring/sp-settings.controller";
import * as applicationSearchController from "../controllers/screen-proctoring/sp-application-search.controller";
import * as institutionsController from "../controllers/seb-server/institution.controller";
import * as clientConnectionController from "../controllers/seb-server/client-connection.controller";
import {grantExamAppSignatureKey} from "../controllers/seb-server/exam.controller";

const router: Router = express.Router();

// system
router.get(constants.SYSTEM_FEATURE_ROUTE, systemController.getSystemFeatures)

//quiz
router.get(constants.QUIZ_ROUTE, quizController.getQuizzes);

//exams 
router.get(constants.EXAMS_ROUTE, examController.getExams);
router.post(constants.EXAM_ROUTE, examController.createExam);
router.delete(constants.EXAM_ROUTE + "/:id", examController.deleteExam);
router.put(constants.EXAM_ROUTE + "/:id", examController.updateExam);
router.patch(constants.EXAM_ARCHIVE_ROUTE, examController.archiveExam)
router.get(constants.EXAM_GET_ROUTE + "/:id", examController.getExam);
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

// SEB Settings Exam
router.get(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id/examConfigMapping", examSEBSettingsController.getExamConfigMapping);

router.post(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id/table/:name/row", examSEBSettingsController.addTableRow);
router.delete(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id/table/:name/row/:listIndex", examSEBSettingsController.deleteTableRow);
router.post(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id", examSEBSettingsController.updateSEBSetting);
router.get(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id/active-seb-clients", examSEBSettingsController.getActiveSEBClients);
router.post(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id/publish", examSEBSettingsController.publishSettings);
router.post(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id/undo-changes", examSEBSettingsController.undoChanges);
router.get(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id/:viewType", examSEBSettingsController.getView);

// SEB Settings Template
router.get(constants.TEMPLATE_SEB_SETTINGS_ROUTE + "/:id" + "/:viewType", templateSEBSettingsController.getView);
router.post(constants.TEMPLATE_SEB_SETTINGS_ROUTE + "/:id" + "/table/:name/row", templateSEBSettingsController.addTableRow);
router.delete(constants.TEMPLATE_SEB_SETTINGS_ROUTE + "/:id" + "/table/:name/row/:listIndex", templateSEBSettingsController.deleteTableRow);
router.post(constants.TEMPLATE_SEB_SETTINGS_ROUTE + "/:id", templateSEBSettingsController.updateSEBSetting);

//screen proctoring
router.post(constants.EXAM_SCREEN_PROCTORING_ROUTE, screenProctoringController.saveScreenProctoringSettings);
router.post(constants.EXAM_SCREEN_PROCTORING_ROUTE + "/apply-groups", screenProctoringController.applyScreenProctoringGroups);
router.post(constants.EXAM_SCREEN_PROCTORING_ROUTE + "/activation", screenProctoringController.activateScreenProctoring);

//institutions
router.get(constants.INSTITUTION_ROUTE, institutionsController.getInstitutions);
router.get(constants.INSTITUTION_ROUTE, institutionsController.getInstitutions);
router.get(constants.ADMIN_INSTITUTION_LOGO_ROUTE + "/:suffix", institutionsController.getInstitutionLogo)

//user accounts
router.post(constants.USER_ACCOUNT_REGISTRATION_ROUTE, userAccountController.registerUserAccount);

//connection configurations
router.get(constants.DOWNLOAD_EXAM_CONFIG_ROUTE + "/:id", configurationController.downloadExamConfig);
router.get(constants.CONNECTION_CONFIG_ROUTE + "/:id", configurationController.getConnectionConfiguration);
router.post(constants.CONNECTION_CONFIG_ROUTE + "/:id" + constants.ACTIVATION_ROUTE, configurationController.activateConnectionConfiguration);
router.post(constants.CONNECTION_CONFIG_ROUTE + "/:id" + constants.DEACTIVATION_ROUTE, configurationController.deactivateConnectionConfiguration);
router.delete(constants.CONNECTION_CONFIG_ROUTE+ "/:id", configurationController.deleteConnectionConfiguration);
router.post(constants.CONNECTION_CONFIG_ROUTE, configurationController.createConnectionConfiguration);
router.put(constants.CONNECTION_CONFIG_ROUTE, configurationController.editConnectionConfiguration);

//assessment tool
router.get(constants.ASSESSMENT_TOOL_GET_ROUTE + "/:id", assessmentToolController.getAssessmentTool);
router.get(constants.ASSESSMENT_TOOL_ROUTE, assessmentToolController.getAssessmentTools);
router.get(constants.ASSESSMENT_TOOL_ROUTE + constants.ACTIVE, assessmentToolController.getAssessmentToolsActive);
router.post(constants.ASSESSMENT_TOOL_ROUTE + "/:id" + constants.ACTIVATION_ROUTE, assessmentToolController.activateAssessmentTool);
router.post(constants.ASSESSMENT_TOOL_ROUTE + "/:id" + constants.DEACTIVATION_ROUTE, assessmentToolController.deactivateAssessmentTool);
router.delete(constants.ASSESSMENT_TOOL_ROUTE+ "/:id", assessmentToolController.deleteAssessmentTool);
router.post(constants.ASSESSMENT_TOOL_ROUTE, assessmentToolController.createAssessmentTool);
router.put(constants.ASSESSMENT_TOOL_ROUTE, assessmentToolController.editAssessmentTool);

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

// router.get("/sp/useraccount/me", spUserAccountController.getPersonalUserAccount);
// router.get("/sp/useraccount/:accountId", spUserAccountController.getUserAccountById);
// router.get("/sp/useraccount", spUserAccountController.getUserAccounts);
// router.post("/sp/useraccount/register", spAuthorizationAdditional.isUserAccountOperationAllowed, spUserAccountController.registerUserAccount);
// router.post("/sp/useraccount/changePassword", spAuthorizationAdditional.isUserAccountOperationAllowed, spUserAccountController.changePassword);
// router.post("/sp/useraccount/activate/:accountId", spAuthorizationAdditional.isUserAccountOperationAllowed, spUserAccountController.activateUserAccount);
// router.post("/sp/useraccount/deactivate/:accountId", spAuthorizationAdditional.isUserAccountOperationAllowed, spUserAccountController.deactivateUserAccount);



export default router;