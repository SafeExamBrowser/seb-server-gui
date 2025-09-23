import StepNaming from "./components/stepNaming/StepNaming.vue";
import StepSupervisors from "./components/stepSupervisors/StepSupervisors.vue";
import StepIndicators from "./components/stepIndicators/stepIndicators.vue";
import StepClientGroup from "./components/stepClientGroup/stepClientGroup.vue";
import StepSummary from "./components/stepSummary/StepSummary.vue";

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
