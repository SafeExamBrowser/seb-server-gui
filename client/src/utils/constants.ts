import ImportAssessmentInfo from "@/components/views/seb-server/quiz-import/info-box-content/ImportAssessmentInfo.vue";
import ImportAssessmentMain from "@/components/views/seb-server/quiz-import/main-content/ImportAssessmentMain.vue";
import ImportExamInfo from "@/components/views/seb-server/quiz-import/info-box-content/ImportExamInfo.vue";
import ImportExamMain from "@/components/views/seb-server/quiz-import/main-content/ImportExamMain.vue";
import ImportTemplateInfo from "@/components/views/seb-server/quiz-import/info-box-content/ImportTemplateInfo.vue";
import ImportTemplateMain from "@/components/views/seb-server/quiz-import/main-content/ImportTemplateMain.vue";
import ImportSupervisorInfo from "@/components/views/seb-server/quiz-import/info-box-content/ImportSupervisorInfo.vue";
import ImportSupervisorMain from "@/components/views/seb-server/quiz-import/main-content/ImportSupervisorMain.vue";
import ImportPasswordInfo from "@/components/views/seb-server/quiz-import/info-box-content/ImportPasswordInfo.vue";
import ImportPasswordMain from "@/components/views/seb-server/quiz-import/main-content/ImportPasswordMain.vue";
import ImportSummaryInfo from "@/components/views/seb-server/quiz-import/info-box-content/ImportSummaryInfo.vue";
import ImportSummaryMain from "@/components/views/seb-server/quiz-import/main-content/ImportSummaryMain.vue";
import {translate} from "@/utils/generalUtils";
import {id} from "vuetify/locale";

//navigation routes
export const DEFAULT_ROUTE: string = "/";
export const REGISTER_ROUTE: string = "/register";
export const HOME_PAGE_ROUTE: string = "/home";
export const NAVIGATION_OVERVIEW_ROUTE: string = "/navigation-overview";
export const USER_ACCOUNTS_ROUTE: string = "/user-accounts";

export const EDIT_USER_ACCOUNT: string = USER_ACCOUNTS_ROUTE + "/edit-account";
export const PROFILE_ROUTE = "/profile-settings";

export const CREATE_USER_ACCOUNTS_ROUTE: string = USER_ACCOUNTS_ROUTE + "/create";
export const EXAM_ROUTE: string = "/exam";
export const EXAM_DETAILS_ROUTE: string = EXAM_ROUTE;

export const EXAM_LMS_IMPORT_ROUTE: string = EXAM_ROUTE + "/lms"
export const ACCOUNT_VIEW_ROUTE: string = "/account";

export const MONITORING_ROUTE: string = "/monitoring";
export const MONITORING_OVERVIEW_ROUTE: string = MONITORING_ROUTE + "/overview";
export const MONITORING_CLIENTS_ROUTE: string = MONITORING_ROUTE + "/clients";
export const MONITORING_DETAILS_ROUTE: string = MONITORING_ROUTE + "/:examId" + "/details"

// export const USER_ACCOUNTS_ROUTE: string = MONITORING_ROUTE + "/userAccounts";


export const QUIZ_IMPORT_ROUTE: string = "/quiz-import";


//quiz import wizard steps & components
export function getQuizImportGroupStep(i18nParam?: any | null): ImportWizardSteps{
    if(i18nParam != null){
        return {name: translate('quizImportWizard.steps.selectGroup', i18nParam), value: 4, type: "group"};
    }

    return {name: translate('quizImportWizard.steps.selectGroup'), value: 4, type: "group"};
}

export function getQuizImportSteps(i18nParam?: any | null): ImportWizardSteps[]{
    if(i18nParam != null){
        return [
            {name: translate('quizImportWizard.steps.selectAssessmentTool', i18nParam), value: 1},
            {name: translate('quizImportWizard.steps.selectExam', i18nParam), value: 2},
            {name: translate('quizImportWizard.steps.chooseTemplate', i18nParam), value: 3},
            {name: translate('quizImportWizard.steps.addSupervisors', i18nParam), value: 4},
            {name: translate('quizImportWizard.steps.quitPassword', i18nParam), value: 5},
            {name: translate('quizImportWizard.steps.configurationSummary', i18nParam), value: 6}
        ];
    }

    return [
        {name: translate('quizImportWizard.steps.selectAssessmentTool'), value: 1},
        {name: translate('quizImportWizard.steps.selectExam'), value: 2},
        {name: translate('quizImportWizard.steps.chooseTemplate'), value: 3},
        {name: translate('quizImportWizard.steps.addSupervisors'), value: 4},
        {name: translate('quizImportWizard.steps.quitPassword'), value: 5},
        {name: translate('quizImportWizard.steps.configurationSummary'), value: 6}
    ];
}

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
