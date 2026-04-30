import ImportAssessmentInfo from "@/pages/(app)/quiz-import/components/info-box-content/ImportAssessmentInfo.vue";
import ImportAssessmentMain from "@/pages/(app)/quiz-import/components/main-content/ImportAssessmentMain.vue";
import ImportExamInfo from "@/pages/(app)/quiz-import/components/info-box-content/ImportExamInfo.vue";
import ImportExamMain from "@/pages/(app)/quiz-import/components/main-content/ImportExamMain.vue";
import ImportTemplateInfo from "@/pages/(app)/quiz-import/components/info-box-content/ImportTemplateInfo.vue";
import ImportTemplateMain from "@/pages/(app)/quiz-import/components/main-content/ImportTemplateMain.vue";
import ImportSupervisorInfo from "@/pages/(app)/quiz-import/components/info-box-content/ImportSupervisorInfo.vue";
import ImportSupervisorMain from "@/pages/(app)/quiz-import/components/main-content/ImportSupervisorMain.vue";
import ImportPasswordInfo from "@/pages/(app)/quiz-import/components/info-box-content/ImportPasswordInfo.vue";
import ImportPasswordMain from "@/pages/(app)/quiz-import/components/main-content/ImportPasswordMain.vue";
import ImportSummaryInfo from "@/pages/(app)/quiz-import/components/info-box-content/ImportSummaryInfo.vue";
import ImportSummaryMain from "@/pages/(app)/quiz-import/components/main-content/ImportSummaryMain.vue";
import { translate } from "@/utils/generalUtils";
import type { Component } from "vue";
import { ImportWizardSteps } from "@/models/types";

// navigation routes

export const EXAM_ROUTE: string = "/exam";

export const MONITORING_ROUTE: string = "/monitoring";
export const MONITORING_OVERVIEW_ROUTE: string = MONITORING_ROUTE + "/overview";
export const MONITORING_CLIENTS_ROUTE: string = MONITORING_ROUTE + "/clients";
export const MONITORING_DETAILS_ROUTE: string =
    MONITORING_ROUTE + "/:examId" + "/details";

export const FINISHED_EXAM_DATA_ROUTE: string = "/finished-exam-data";

export const ASSESSMENT_TOOL_CONNECTIONS_ROUTE: string =
    "/assessment-tool-connections";

// seb client configs
export const CONNECTION_CONFIGURATIONS_ROUTE: string =
    "/connection-configurations";

export const QUIZ_IMPORT_ROUTE: string = "/quiz-import";

type I18nLike = { t: (key: string, ...args: unknown[]) => string };

// quiz import wizard steps & components
export function getQuizImportGroupStep(
    i18nParam?: I18nLike | null,
): ImportWizardSteps {
    return {
        name: translate(
            "quizImportWizard.steps.selectGroup",
            i18nParam ?? undefined,
        ),
        value: 4,
        type: "group",
    };
}

export function getQuizImportSteps(
    i18nParam?: I18nLike | null,
): ImportWizardSteps[] {
    return [
        {
            name: translate(
                "quizImportWizard.steps.selectAssessmentTool",
                i18nParam ?? undefined,
            ),
            value: 1,
        },
        {
            name: translate(
                "quizImportWizard.steps.selectExam",
                i18nParam ?? undefined,
            ),
            value: 2,
        },
        {
            name: translate(
                "quizImportWizard.steps.chooseTemplate",
                i18nParam ?? undefined,
            ),
            value: 3,
        },
        {
            name: translate(
                "quizImportWizard.steps.addSupervisors",
                i18nParam ?? undefined,
            ),
            value: 4,
        },
        {
            name: translate(
                "quizImportWizard.steps.quitPassword",
                i18nParam ?? undefined,
            ),
            value: 5,
        },
        {
            name: translate(
                "quizImportWizard.steps.configurationSummary",
                i18nParam ?? undefined,
            ),
            value: 6,
        },
    ];
}

export const quizImportInfoBoxComponents: Component[] = [
    ImportAssessmentInfo,
    ImportExamInfo,
    ImportTemplateInfo,
    ImportSupervisorInfo,
    ImportPasswordInfo,
    ImportSummaryInfo,
];

export const quizImportMainContentComponents: Component[] = [
    ImportAssessmentMain,
    ImportExamMain,
    ImportTemplateMain,
    ImportSupervisorMain,
    ImportPasswordMain,
    ImportSummaryMain,
];
