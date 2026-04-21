import { SummarySectionData } from "@/components/widgets/wizardSummary/types";
import { computed } from "vue";
import { useCreateExamTemplateStore } from "@/components/views/seb-server/exam-template/wizard/composables/store/useCreateExamTemplateStore";
import { getSummaryClientGroups } from "@/components/views/seb-server/exam-template/wizard/components/stepSummary/helpers/getSummaryClientGroups";
import { getSummaryNaming } from "@/components/views/seb-server/exam-template/wizard/components/stepSummary/helpers/getSummaryNaming";
import { getSummaryIndicators } from "@/components/views/seb-server/exam-template/wizard/components/stepSummary/helpers/getSummaryIndicators";
import { getSummarySupervisors } from "@/components/views/seb-server/exam-template/wizard/components/stepSummary/helpers/getSummarySupervisors";
import { useSupervisors } from "@/composables/useSupervisors";
import { useClientConfigurationNames } from "@/composables/useClientConfigurationNames";

export const useSummary = () => {
    const examTemplate = useCreateExamTemplateStore().examTemplate;

    const {
        data: supervisors,
        loading: loadingSupervisors,
        error: errorSupervisors,
    } = useSupervisors();

    const {
        data: clientConfigurationNames,
        loading: loadingClientConfigurationNames,
        error: errorClientConfigurationNames,
    } = useClientConfigurationNames();

    const loading = computed(
        () => loadingSupervisors.value || loadingClientConfigurationNames.value,
    );

    const errors = computed(() =>
        [errorSupervisors.value, errorClientConfigurationNames.value].filter(
            (error) => error !== undefined,
        ),
    );

    const summarySections = computed<SummarySectionData[]>(() => {
        if (loading.value || errors.value.length > 0) {
            return [];
        }

        return [
            getSummaryNaming(
                examTemplate,
                clientConfigurationNames.value ?? [],
            ),
            getSummarySupervisors(examTemplate, supervisors.value ?? []),
            getSummaryIndicators(examTemplate),
            getSummaryClientGroups(examTemplate),
        ];
    });

    return { summarySections, loading, errors };
};
