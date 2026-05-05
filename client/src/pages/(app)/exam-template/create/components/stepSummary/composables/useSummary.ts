import { SummarySectionData } from "@/components/widgets/wizardSummary/types.ts";
import { computed } from "vue";
import { useCreateExamTemplateStore } from "@/pages/(app)/exam-template/create/composables/store/useCreateExamTemplateStore.ts";
import { getSummaryClientGroups } from "@/pages/(app)/exam-template/create/components/stepSummary/helpers/getSummaryClientGroups.ts";
import { getSummaryNaming } from "@/pages/(app)/exam-template/create/components/stepSummary/helpers/getSummaryNaming.ts";
import { getSummaryIndicators } from "@/pages/(app)/exam-template/create/components/stepSummary/helpers/getSummaryIndicators.ts";
import { getSummarySupervisors } from "@/pages/(app)/exam-template/create/components/stepSummary/helpers/getSummarySupervisors.ts";
import { useSupervisors } from "@/composables/useSupervisors.ts";
import { useClientConfigurationNames } from "@/composables/useClientConfigurationNames.ts";

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
