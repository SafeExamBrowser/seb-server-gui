import { SummarySectionData } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";
import { ComputedRef } from "vue";
import { computed } from "vue";
import { useCreateExamTemplateStore } from "@/components/views/seb-server/template/exam/composables/store/useCreateExamTemplateStore";
import { useSummaryClientGroups } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummaryClientGroups";
import { useSummaryNaming } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummaryNaming";
import { useSummaryIndicators } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummaryIndicators";
import { useSummarySupervisors } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummarySupervisors";
import { useSupervisors } from "@/composables/useSupervisors";

export const useSummary = (): ComputedRef<SummarySectionData[]> => {
    const examTemplate = useCreateExamTemplateStore().examTemplate;

    const {
        data: supervisors,
        loading,
        error: errorLoading,
    } = useSupervisors();

    const summary = computed<SummarySectionData[]>(() => {
        const userAccounts =
            loading.value || errorLoading.value || !supervisors.value
                ? []
                : supervisors.value;

        return [
            useSummaryNaming(examTemplate),
            useSummarySupervisors(examTemplate, userAccounts),
            useSummaryIndicators(examTemplate),
            useSummaryClientGroups(examTemplate),
        ];
    });

    return summary;
};
