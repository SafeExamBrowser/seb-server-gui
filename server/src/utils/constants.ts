//routes - always the same route for the B4F and to call SEB-Server


//retrieves all quizzes that are ready for import --> quiz turns into exam as soon as its imported
export const QUIZ_ROUTE = "/quiz";

export const EXAM_ROUTE = "/exam";
export const EXAM_ARCHIVE_ROUTE = "/exam/:id/archive";
export const EXAM_GET_ROUTE = "/get-exam";
export const EXAMS_ROUTE = "/exams";
export const EXAM_CONFIGURATION_MAP_ROUTE = "/exam-configuration-map";
export const EXAM_SCREEN_PROCTORING_ROUTE = "/exam/:id/screen-proctoring"

export const EXAM_TEMPLATE_ROUTE = "/exam-template";

export const USER_ACCOUNT_ROUTE = "/useraccount";
export const USER_ACCOUNT_NAMES_ROUTE = "/useraccount/names";

export const CONNECTION_CONFIG_ROUTE = "/client_configuration";
export const DOWNLOAD_EXAM_CONFIG_ROUTE = "/client_configuration/download";

export const ASSESSMENT_TOOL_ROUTE = "/assessment-tools";

export const MONITORING_TEST_RUN_ROUTE = "/monitoring/testrun";

export const CLIENT_GROUP_ROUTE = "/client-group";