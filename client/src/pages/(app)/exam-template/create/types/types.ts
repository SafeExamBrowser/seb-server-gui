import StepNaming from "@/pages/(app)/exam-template/create/components/stepNaming/StepNaming.vue";
import StepSupervisors from "@/pages/(app)/exam-template/create/components/stepSupervisors/StepSupervisors.vue";
import StepIndicators from "@/pages/(app)/exam-template/create/components/stepIndicators/stepIndicators.vue";
import StepClientGroup from "@/pages/(app)/exam-template/create/components/stepClientGroup/stepClientGroup.vue";
import StepSummary from "@/pages/(app)/exam-template/create/components/stepSummary/StepSummary.vue";
import StepSEBSettings from "@/pages/(app)/exam-template/create/components/stepSEBSettings/StepSEBSettings.vue";

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
