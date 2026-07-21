import StepClientGroup from "@/pages/(app)/exam-template/create/components/stepClientGroup/stepClientGroup.vue";
import StepIndicators from "@/pages/(app)/exam-template/create/components/stepIndicators/stepIndicators.vue";
import StepNaming from "@/pages/(app)/exam-template/create/components/stepNaming/StepNaming.vue";
import StepSEBSettings from "@/pages/(app)/exam-template/create/components/stepSEBSettings/StepSEBSettings.vue";
import StepSummary from "@/pages/(app)/exam-template/create/components/stepSummary/StepSummary.vue";
import StepSupervisors from "@/pages/(app)/exam-template/create/components/stepSupervisors/StepSupervisors.vue";

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
