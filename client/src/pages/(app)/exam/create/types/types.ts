import StepAssessmentTool from "@/pages/(app)/exam/create/components/stepAssessmentTool/StepAssessmentTool.vue";
import StepQuiz from "@/pages/(app)/exam/create/components/stepQuiz/StepQuiz.vue";
import StepExamTemplate from "@/pages/(app)/exam/create/components/stepExamTemplate/StepExamTemplate.vue";
import StepClientGroups from "@/pages/(app)/exam/create/components/stepClientGroups/StepClientGroups.vue";
import StepSupervisors from "@/pages/(app)/exam/create/components/stepSupervisors/StepSupervisors.vue";
import StepQuitPassword from "@/pages/(app)/exam/create/components/stepQuitPassword/StepQuitPassword.vue";
import StepSummary from "@/pages/(app)/exam/create/components/stepSummary/StepSummary.vue";

export const stepComponents = {
    StepAssessmentTool,
    StepQuiz,
    StepExamTemplate,
    StepClientGroups,
    StepSupervisors,
    StepQuitPassword,
    StepSummary,
} as const;

export interface StepItemCreateExam {
    title: string;
    componentName: keyof typeof stepComponents;
}
