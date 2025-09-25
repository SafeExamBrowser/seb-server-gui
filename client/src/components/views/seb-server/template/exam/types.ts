import StepNaming from "./stepNaming/StepNaming.vue";
import StepSupervisors from "./stepSupervisors/StepSupervisors.vue";
import StepIndicators from "./stepIndicators/stepIndicators.vue";
import StepClientGroup from "./stepClientGroup/stepClientGroup.vue";
import StepSummary from "./stepSummary/StepSummary.vue";

export const stepComponents = {
    StepNaming,
    StepSupervisors,
    StepIndicators,
    StepClientGroup,
    StepSummary,
} as const;

export interface StepItemCreateTemplateExam {
    title: string;
    componentName: keyof typeof stepComponents;
}
