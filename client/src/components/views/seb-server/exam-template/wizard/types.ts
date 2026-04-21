import StepNaming from "./components/stepNaming/StepNaming.vue";
import StepSupervisors from "./components/stepSupervisors/StepSupervisors.vue";
import StepIndicators from "./components/stepIndicators/stepIndicators.vue";
import StepClientGroup from "./components/stepClientGroup/stepClientGroup.vue";
import StepSummary from "./components/stepSummary/StepSummary.vue";
import StepSEBSettings from "./components/stepSEBSettings/StepSEBSettings.vue";

export const stepComponents = {
    StepNaming,
    StepSEBSettings,
    StepSupervisors,
    StepIndicators,
    StepClientGroup,
    StepSummary,
} as const;

export interface StepItemCreateTemplateExam {
    title: string;
    componentName: keyof typeof stepComponents;
}

export const SCREEN_PROCTORING_COLLECTION_STRATEGY = [
    "EXAM",
    "APPLY_SEB_GROUPS",
] as const;

export type ScreenProctoringCollectionStrategy =
    (typeof SCREEN_PROCTORING_COLLECTION_STRATEGY)[number];
