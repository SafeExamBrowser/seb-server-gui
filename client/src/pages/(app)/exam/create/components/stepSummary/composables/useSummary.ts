import { computed } from "vue";
import { SummarySectionData } from "@/components/widgets/wizardSummary/types.ts";
import { useStepAssessmentToolStore } from "@/pages/(app)/exam/create/components/stepAssessmentTool/composables/store/useStepAssessmentToolStore.ts";
import { useStepQuizStore } from "@/pages/(app)/exam/create/components/stepQuiz/composables/store/useStepQuizStore.ts";
import { useStepExamTemplateStore } from "@/pages/(app)/exam/create/components/stepExamTemplate/composables/store/useStepExamTemplateStore.ts";
import { useStepClientGroupsStore } from "@/pages/(app)/exam/create/components/stepClientGroups/composables/store/useStepClientGroupsStore.ts";
import { useStepSupervisorsStore } from "@/pages/(app)/exam/create/components/stepSupervisors/composables/store/useStepSupervisorsStore.ts";
import { useStepQuitPasswordStore } from "@/pages/(app)/exam/create/components/stepQuitPassword/composables/store/useStepQuitPasswordStore.ts";
import { useAssessmentTools } from "@/pages/(app)/exam/create/components/stepAssessmentTool/composables/api/useAssessmentTools.ts";
import { useSupervisors } from "@/composables/useSupervisors.ts";
import { getSummaryAssessmentTool } from "@/pages/(app)/exam/create/components/stepSummary/helpers/getSummaryAssessmentTool.ts";
import { getSummaryQuiz } from "@/pages/(app)/exam/create/components/stepSummary/helpers/getSummaryQuiz.ts";
import { getSummaryExamTemplate } from "@/pages/(app)/exam/create/components/stepSummary/helpers/getSummaryExamTemplate.ts";
import { getSummaryClientGroups } from "@/pages/(app)/exam/create/components/stepSummary/helpers/getSummaryClientGroups.ts";
import { getSummarySupervisors } from "@/pages/(app)/exam/create/components/stepSummary/helpers/getSummarySupervisors.ts";
import { getSummaryQuitPassword } from "@/pages/(app)/exam/create/components/stepSummary/helpers/getSummaryQuitPassword.ts";

export const useSummary = () => {
    const assessmentToolStore = useStepAssessmentToolStore();
    const quizStore = useStepQuizStore();
    const examTemplateStore = useStepExamTemplateStore();
    const clientGroupsStore = useStepClientGroupsStore();
    const supervisorsStore = useStepSupervisorsStore();
    const quitPasswordStore = useStepQuitPasswordStore();

    const {
        data: assessmentTools,
        loading: loadingAssessmentTools,
        error: errorAssessmentTools,
    } = useAssessmentTools();

    const {
        data: supervisors,
        loading: loadingSupervisors,
        error: errorSupervisors,
    } = useSupervisors();

    const loading = computed(
        () => loadingAssessmentTools.value || loadingSupervisors.value,
    );

    const errors = computed(() =>
        [errorAssessmentTools.value, errorSupervisors.value].filter(
            (error) => error !== undefined,
        ),
    );

    const summarySections = computed<SummarySectionData[]>(() => {
        if (loading.value || errors.value.length > 0) {
            return [];
        }

        return [
            getSummaryAssessmentTool(
                assessmentToolStore.selectedAssessmentToolId,
                assessmentTools.value?.content ?? [],
            ),
            getSummaryQuiz(quizStore.selectedQuiz),
            getSummaryExamTemplate(examTemplateStore.selectedExamTemplate),
            getSummaryClientGroups(clientGroupsStore.selectedClientGroups),
            getSummarySupervisors(
                supervisorsStore.selectedSupervisorIds,
                supervisors.value ?? [],
            ),
            getSummaryQuitPassword(quitPasswordStore.quitPassword),
        ];
    });

    return { summarySections, loading, errors };
};
