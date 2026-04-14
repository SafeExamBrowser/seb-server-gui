import { SummarySectionData } from "@/components/widgets/wizardSummary/types";
import { computed, onMounted } from "vue";
import { useCreateExamTemplateStore } from "@/components/views/seb-server/exam-template/wizard/composables/store/useCreateExamTemplateStore";
import { getSummaryClientGroups } from "@/components/views/seb-server/exam-template/wizard/components/stepSummary/helpers/getSummaryClientGroups";
import { getSummaryNaming } from "@/components/views/seb-server/exam-template/wizard/components/stepSummary/helpers/getSummaryNaming";
import { getSummaryIndicators } from "@/components/views/seb-server/exam-template/wizard/components/stepSummary/helpers/getSummaryIndicators";
import { getSummarySupervisors } from "@/components/views/seb-server/exam-template/wizard/components/stepSummary/helpers/getSummarySupervisors";
import { useSupervisors } from "@/composables/useSupervisors";
import { useConfigurationTemplateNames } from "@/composables/useConfigurationTemplateNames";
import { useClientConfigurationNames } from "@/composables/useClientConfigurationNames";

export const useSummary = () => {
    const examTemplate = useCreateExamTemplateStore().examTemplate;

    const {
        data: supervisors,
        loading: loadingSupervisors,
        error: errorSupervisors,
        fetchData: fetchSupervisors,
    } = useSupervisors();

    const {
        data: configurationTemplateNames,
        loading: loadingConfigurationTemplateNames,
        error: errorConfigurationTemplateNames,
        fetchData: fetchConfigTemplateNames,
    } = useConfigurationTemplateNames();

    const {
        data: clientConfigurationNames,
        loading: loadingClientConfigurationNames,
        error: errorClientConfigurationNames,
        fetchData: fetchClientConfigNames,
    } = useClientConfigurationNames();

    onMounted(() => {
        fetchSupervisors();
        fetchConfigTemplateNames();
        fetchClientConfigNames();
    });

    const loading = computed(
        () =>
            loadingSupervisors.value ||
            loadingConfigurationTemplateNames.value ||
            loadingClientConfigurationNames.value,
    );

    const errors = computed(() =>
        [
            errorSupervisors.value,
            errorConfigurationTemplateNames.value,
            errorClientConfigurationNames.value,
        ].filter((error) => error !== undefined),
    );

    const summarySections = computed<SummarySectionData[]>(() => {
        if (loading.value || errors.value.length > 0) {
            return [];
        }

        return [
            getSummaryNaming(
                examTemplate,
                configurationTemplateNames.value ?? [],
                clientConfigurationNames.value ?? [],
            ),
            getSummarySupervisors(examTemplate, supervisors.value ?? []),
            getSummaryIndicators(examTemplate),
            getSummaryClientGroups(examTemplate),
        ];
    });

    return { summarySections, loading, errors };
};
