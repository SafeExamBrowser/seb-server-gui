import express, {Router} from "express";
import * as quizController from "../controllers/seb-server/quiz.controller";
import * as examController from "../controllers/seb-server/exam.controller";
import * as configurationController from "../controllers/seb-server/configuration.controller";
import * as examTemplateController from "../controllers/seb-server/exam-template.controller";
import * as screenProctoringController from "../controllers/seb-server/screen-proctoring.controller";
import * as indicatorController from "../controllers/seb-server/indicator.controller";
import * as userAccountController from "../controllers/seb-server/user-account.controller";
import * as assessmentToolController from "../controllers/seb-server/assessment-tool.controller";
import * as monitoringController from "../controllers/seb-server/monitoring.controller";
import * as clientGroupsController from "../controllers/seb-server/client-groups.controller";
import * as constants from "../utils/constants";
import * as examSEBSettingsController from "../controllers/seb-server/exam-sebsettings.controller";

//screen-proctoring
import * as groupController from "../controllers/screen-proctoring/sp-group.controller";
import * as screenshotDataController from "../controllers/screen-proctoring/sp-screenshot-data.controller";
import * as searchController from "../controllers/screen-proctoring/sp-search.controller";
import * as spUserAccountController from "../controllers/screen-proctoring/sp-user-account.controller";
import * as settingsController from "../controllers/screen-proctoring/sp-settings.controller";
import * as applicationSearchController from "../controllers/screen-proctoring/sp-application-search.controller";
import * as spAuthorizationAdditional from "../middleware/spAuthorizationAdditional";
import * as institutionsController from "../controllers/seb-server/institution.controller";
import {
    ADMIN_INSTITUTION_INFO_ROUTE,
    ADMIN_INSTITUTION_LOGO_ROUTE,
    MONITORING_LOGS_ROUTE,
    USER_ACCOUNT_REGISTRATION_ROUTE
} from "../utils/constants";
import {getUserAccountFeatures} from "../controllers/seb-server/user-account.controller";

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
router.get(constants.EXAM_ROUTE + "/:id" + constants.KEY_INFO_ROUTE, examController.getExamAppSignatureKeys);
router.get(constants.EXAM_CONFIGURATION_MAP_ROUTE + "/:id", examController.getExamConfigurationMap);
router.get(constants.EXAMS_ROUTE + "/monitoring", examController.getExamsForMonitoring);

// SEB lock
router.put(constants.EXAM_ROUTE + "/:id" + "/apply-seb-restriction", examController.putSEBLock);
router.delete(constants.EXAM_ROUTE + "/:id" + "/apply-seb-restriction", examController.deleteSEBLock);
router.get(constants.EXAM_ROUTE + "/:id" + "/check-seb-restriction", examController.checkSEBLock)


// SEB Settings
router.get(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id" + "/examConfigMapping", examSEBSettingsController.getExamConfigMapping);
router.get(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id" + "/APPLICATION", examSEBSettingsController.getApplicationView);
router.get(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id" + "/NETWORK", examSEBSettingsController.getNetworkView);
router.post(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id" + "/table/:name/row", examSEBSettingsController.addTableRow);
router.delete(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id" + "/table/:name/row/:listIndex", examSEBSettingsController.deleteTableRow);
router.post(constants.EXAM_SEB_SETTINGS_ROUTE + "/:id", examSEBSettingsController.updateSEBSetting);

//screen proctoring
router.post(constants.EXAM_SCREEN_PROCTORING_ROUTE, screenProctoringController.saveScreenProctoringSettings);
router.post(constants.EXAM_SCREEN_PROCTORING_ROUTE + "/apply-groups", screenProctoringController.applyScreenProctoringGroups);
router.post(constants.EXAM_SCREEN_PROCTORING_ROUTE + "/activation", screenProctoringController.activateScreenProctoring);

//exam template
router.get(constants.EXAM_TEMPLATE_ROUTE + "/:id", examTemplateController.getExamTemplate);
router.get(constants.EXAM_TEMPLATE_ROUTE, examTemplateController.getExamTemplates);
router.get(constants.EXAM_TEMPLATE_SCREEN_PROCTORING_ROUTE, examTemplateController.getExamTemplateSp);

//institutions
router.get(constants.INSTITUTION_ROUTE, institutionsController.getInstitutions);
router.get(constants.INSTITUTION_ROUTE, institutionsController.getInstitutions);
router.get(constants.ADMIN_INSTITUTION_LOGO_ROUTE + "/:suffix", institutionsController.getInstitutionLogo)

//user accounts
router.get(constants.USER_ACCOUNT_ROUTE + "/:id", userAccountController.getUserAccount);
router.get(constants.USER_ACCOUNT_ROUTE, userAccountController.getUserAccounts);
router.get(constants.FEATURE_ROUTE, userAccountController.getUserAccountFeatures);
router.get(constants.USER_ACCOUNT_NAMES_ROUTE, userAccountController.getUserAccountNames);
router.get(constants.SUPERVISOR_ACCOUNT_NAMES_ROUTE, userAccountController.getSupervisorAccountNames);
router.post(constants.USER_ACCOUNT_REGISTRATION_ROUTE, userAccountController.registerUserAccount);
router.post(constants.USER_ACCOUNT_ROUTE + "/:modelId" + constants.ACTIVATION_ROUTE, userAccountController.activateAccount);
router.post(constants.USER_ACCOUNT_ROUTE + "/:modelId" + constants.DEACTIVATION_ROUTE, userAccountController.deactivateAccount);
router.post(constants.USER_ACCOUNT_ROUTE, userAccountController.createUserAccount);
router.put(constants.USER_ACCOUNT_ROUTE, userAccountController.editUserAccount);
router.put(constants.USER_ACCOUNT_ROUTE + constants.CHANGE_PASSWORD_ROUTE, userAccountController.changePassword);
router.delete(constants.USER_ACCOUNT_ROUTE + "/:id", userAccountController.deleteUserAccount);

//connection configurations
router.get(constants.DOWNLOAD_EXAM_CONFIG_ROUTE + "/:id", configurationController.downloadExamConfig);
router.get(constants.CONNECTION_CONFIG_ROUTE, configurationController.getConnectionConfigurations);

//assessment tool
router.get(constants.ASSESSMENT_TOOL_GET_ROUTE + "/:id", assessmentToolController.getAssessmentTool);
router.get(constants.ASSESSMENT_TOOL_ROUTE, assessmentToolController.getAssessmentTools);
router.get(constants.ASSESSMENT_TOOL_ROUTE + constants.ACTIVE, assessmentToolController.getAssessmentToolsActive);


//monitoring
router.post(constants.MONITORING_TEST_RUN_ROUTE + "/:id", monitoringController.applyTestRun);
router.get(constants.MONITORING_OVERVIEW_ROUTE + "/:id", monitoringController.getOverview);
router.get(constants.MONITORING_CONNECTIONS_ROUTE + "/:id", monitoringController.getConnections);
router.get(constants.MONITORING_GET_ROUTE + "/:id/:connectionToken", monitoringController.getSingleConnection);
router.post(constants.MONITORING_ROUTE + "/:id/static-client-data", monitoringController.getStaticClientData);
router.post(constants.MONITORING_INSTRUCTION_ROUTE, monitoringController.registerInstruction);
router.get(constants.MONITORING_NOTIFICATIONS_ROUTE + "/:connectionToken", monitoringController.getPendingNotifications);
router.post(constants.MONITORING_NOTIFICATIONS_ROUTE + "/:notficationId/:connectionToken", monitoringController.confirmNotification);
router.post(constants.MONITORING_DISABLE_CONNECTIONS_ROUTE, monitoringController.disableConnections);
router.get(constants.MONITORING_LOGS_ROUTE + "/:id" , monitoringController.getClientEventLogs);

 

//client groups
router.get(constants.CLIENT_GROUP_ROUTE + "/:id", clientGroupsController.getClientGroup);
router.get(constants.CLIENT_GROUP_ROUTE, clientGroupsController.getClientGroups);
router.post(constants.CLIENT_GROUP_ROUTE, clientGroupsController.createClientGroup);
router.put(constants.CLIENT_GROUP_ROUTE, clientGroupsController.updateClientGroup);
router.delete(constants.CLIENT_GROUP_ROUTE + "/:id", clientGroupsController.deleteClientGroup);

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