import ImportAssessmentInfo from "@/components/views/quiz-import/info-box-content/ImportAssessmentInfo.vue";
import ImportAssessmentMain from "@/components/views/quiz-import/main-content/ImportAssessmentMain.vue";
import ImportExamInfo from "@/components/views/quiz-import/info-box-content/ImportExamInfo.vue"; 
import ImportExamMain from "@/components/views/quiz-import/main-content/ImportExamMain.vue"; 
import ImportTemplateInfo from "@/components/views/quiz-import/info-box-content/ImportTemplateInfo.vue";
import ImportTemplateMain from "@/components/views/quiz-import/main-content/ImportTemplateMain.vue"; 
import ImportSupervisorInfo from "@/components/views/quiz-import/info-box-content/ImportSupervisorInfo.vue"; 
import ImportSupervisorMain from "@/components/views/quiz-import/main-content/ImportSupervisorMain.vue"; 
import ImportPasswordInfo from "@/components/views/quiz-import/info-box-content/ImportPasswordInfo.vue";
import ImportPasswordMain from "@/components/views/quiz-import/main-content/ImportPasswordMain.vue"; 
import ImportSummaryInfo from "@/components/views/quiz-import/info-box-content/ImportSummaryInfo.vue"; 
import ImportSummaryMain from "@/components/views/quiz-import/main-content/ImportSummaryMain.vue"; 


//navigation routes
export const DEFAULT_ROUTE: string = "/";
export const REGISTER_ROUTE: string = "/register";
export const JWT_LOGIN_ROUTE: string = "/jwt";

export const HOME_PAGE_ROUTE: string = "/home";
export const NAVIGATION_OVERVIEW_ROUTE: string = "/navigation-overview";
export const EXAM_ROUTE: string = "/exam";
export const EXAM_LMS_IMPORT_ROUTE: string = EXAM_ROUTE + "/lms"
export const ACCOUNT_VIEW_ROUTE: string = "/account";
export const MONITORING_ROUTE: string = "/monitoring";
export const QUIZ_IMPORT_ROUTE: string = "/quiz-import";


//titles
export const HOME_PAGE_TITLE: string = "Home";

export const NAVIGATION_OVERVIEW_TITLE: string = "Navigation Overview";

export const EXAMS_TITLE: string = "Exams";
export const EXAMS_OVERVIEW_TITLE: string = "Exams Overview";
export const EXAMS_DETAIL_TITLE: string = "Exam Details";


export const MONITORING_TITLE: string = "Monitoring";

export const QUIZ_IMPORT_TITLE: string = "Prepare Exam";



//quiz import wizard steps & components
export const quizImportGroupStep: {name: string, value: number} = {name: "Select Groups", value: 4};
export const quizImportSteps: {name: string, value: number}[] = [
    {name: "Select Assessment Tool", value: 1},
    {name: "Select Exam", value: 2},
    {name: "Choose Template", value: 3},
    {name: "Add Examination Supervisor", value: 4},
    {name: "Set Quit Password", value: 5},
    {name: "Configuration Summary", value: 6}
];

export const quizImportInfoBoxComponents: Component[] = [
    ImportAssessmentInfo,
    ImportExamInfo,
    ImportTemplateInfo,
    ImportSupervisorInfo,
    ImportPasswordInfo,
    ImportSummaryInfo
];

export const quizImportMainContentComponents: Component[] = [
    ImportAssessmentMain,
    ImportExamMain,
    ImportTemplateMain,
    ImportSupervisorMain,
    ImportPasswordMain,   
    ImportSummaryMain
];