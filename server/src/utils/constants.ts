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
export const KEY_INFO_ROUTE = "/sebkeyinfo"
export const GRANT_ROUTE = "/grant"

//institution
export const ADMIN_INSTITUTION_INFO_ROUTE = "/info/institution";
export const INSTITUTION_ROUTE = "/institution";
export const ADMIN_INSTITUTION_LOGO_ROUTE = "/info/logo";
export const SYSTEM_FEATURE_ROUTE = "/info/features";

//user account
export const USER_ACCOUNT_REGISTRATION_SERVER_ROUTE = "/register";
export const USER_ACCOUNT_REGISTRATION_ROUTE = "/useraccount/register";

//monitoring
export const MONITORING_ROUTE = "/monitoring";
export const MONITORING_GET_ROUTE = "/get-monitoring";
export const MONITORING_CONNECTIONS_ROUTE = MONITORING_ROUTE + "/connections";
export const MONITORING_TEST_RUN_ROUTE = MONITORING_ROUTE + "/testrun";
export const MONITORING_OVERVIEW_ROUTE = MONITORING_ROUTE + "/get-overview";
export const MONITORING_INSTRUCTION_ROUTE = MONITORING_ROUTE + "/:id/instruction";
export const MONITORING_QUIT_ALL_ROUTE = MONITORING_ROUTE + "/:id/quitAll";
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

//client Connection
export const CLIENT_CONNECTION_ROUTE = "/seb-client-connection"