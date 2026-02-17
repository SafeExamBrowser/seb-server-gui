//routes - most of the time the same route for the B4F and to call SEB-Server

//retrieves all quizzes that are ready for import --> quiz turns into exam as soon as its imported
export const QUIZ_ROUTE = "/quiz";

//exam
export const EXAM_SCREEN_PROCTORING_ROUTE = "/exam/:id/screen-proctoring"

//institution
export const SYSTEM_FEATURE_ROUTE = "/info/features";

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

//client Connection
export const CLIENT_CONNECTION_ROUTE = "/seb-client-connection"