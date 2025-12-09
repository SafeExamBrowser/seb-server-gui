import { SummarySectionData } from "@/components/widgets/wizardSummary/types";
import { ComputedRef } from "vue";
import { computed } from "vue";
import { useCreateExamTemplateStore } from "@/components/views/seb-server/template/exam/composables/store/useCreateExamTemplateStore";
import { getSummaryClientGroups } from "@/components/views/seb-server/template/exam/components/stepSummary/helpers/getSummaryClientGroups";
import { getSummaryNaming } from "@/components/views/seb-server/template/exam/components/stepSummary/helpers/getSummaryNaming";
import { getSummaryIndicators } from "@/components/views/seb-server/template/exam/components/stepSummary/helpers/getSummaryIndicators";
import { getSummarySupervisors } from "@/components/views/seb-server/template/exam/components/stepSummary/helpers/getSummarySupervisors";
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
            getSummaryNaming(examTemplate),
            getSummarySupervisors(examTemplate, userAccounts),
            getSummaryIndicators(examTemplate),
            getSummaryClientGroups(examTemplate),
        ];
    });

    return summary;
};
