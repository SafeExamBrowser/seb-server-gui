//routes - most of the time the same route for the B4F and to call SEB-Server

//retrieves all quizzes that are ready for import --> quiz turns into exam as soon as its imported
export const QUIZ_ROUTE = "/quiz";

//exam
export const EXAM_ROUTE = "/exam";
export const EXAM_ARCHIVE_ROUTE = "/exam/:id/archive";
export const EXAM_GET_ROUTE = "/get-exam";
export const EXAMS_ROUTE = "/exams";
export const EXAM_CONFIGURATION_MAP_ROUTE = "/exam-configuration-map";
export const EXAM_SCREEN_PROCTORING_ROUTE = "/exam/:id/screen-proctoring"

//exam template
export const EXAM_TEMPLATE_ROUTE = "/exam-template";
export const EXAM_TEMPLATE_SCREEN_PROCTORING_ROUTE = "/exam-template/:id/screen-proctoring";

//institution
export const ADMIN_INSTITUTION_INFO_ROUTE = "/info/institution";
export const INSTITUTION_ROUTE = "/institution";

//user account
export const USER_ACCOUNT_ROUTE = "/useraccount";
export const USER_ACCOUNT_NAMES_ROUTE = "/useraccount/names";
export const USER_ACCOUNT_REGISTRATION_SERVER_ROUTE = "/register";
export const USER_ACCOUNT_REGISTRATION_ROUTE = "/useraccount/register";
export const SUPERVISOR_ACCOUNT_NAMES_ROUTE = "/useraccount/supervisors";
export const DEACTIVATION_ROUTE = "/inactive";
export const ACTIVATION_ROUTE = "/active";

export const CHANGE_PASSWORD_ROUTE = "/password";


//client config
export const CONNECTION_CONFIG_ROUTE = "/client_configuration";
export const DOWNLOAD_EXAM_CONFIG_ROUTE = "/client_configuration/download";

//lms
export const LMS_SETUP_ENDPOINT = "/lms-setup";
export const ASSESSMENT_TOOL_ROUTE = "/assessment-tools";
export const ASSESSMENT_TOOL_GET_ROUTE = "/get-assessment-tool";

//monitoring
export const MONITORING_ROUTE = "/monitoring";
export const MONITORING_GET_ROUTE = "/get-monitoring";
export const MONITORING_CONNECTIONS_ROUTE = MONITORING_ROUTE + "/connections";
export const MONITORING_TEST_RUN_ROUTE = MONITORING_ROUTE + "/testrun";
export const MONITORING_OVERVIEW_ROUTE = MONITORING_ROUTE + "/get-overview";
export const MONITORING_INSTRUCTION_ROUTE = MONITORING_ROUTE + "/:id/instruction";
export const MONITORING_NOTIFICATIONS_ROUTE = MONITORING_ROUTE + "/:id/notification";
export const MONITORING_DISABLE_CONNECTIONS_ROUTE = MONITORING_ROUTE + "/:id/disable-connection";
export const CLIENT_EVENT_URL: string = "/seb-client-event"
export const MONITORING_LOGS_ROUTE = CLIENT_EVENT_URL + "/search";


//client group
export const CLIENT_GROUP_ROUTE = "/client-group";

// exam seb settings
export const EXAM_SEB_SETTINGS_ENDPOINT = EXAM_ROUTE + "/seb-settings";
export const EXAM_SEB_SETTINGS_ROUTE = EXAM_ROUTE + "/seb-settings";

//indicator
export const INDICATOR_ROUTE = "/indicator";

