//routes - most of the time the same route for the B4F and to call SEB-Server

//retrieves all quizzes that are ready for import --> quiz turns into exam as soon as its imported
export const QUIZ_ROUTE = "/quiz";

//exam
export const EXAM_SCREEN_PROCTORING_ROUTE = "/exam/:id/screen-proctoring"

//institution
export const SYSTEM_FEATURE_ROUTE = "/info/features";

//monitoring
export const MONITORING_ROUTE = "/monitoring";
export const MONITORING_NOTIFICATIONS_ROUTE = MONITORING_ROUTE + "/:id/notification";
export const MONITORING_DISABLE_CONNECTIONS_ROUTE = MONITORING_ROUTE + "/:id/disable-connection";
