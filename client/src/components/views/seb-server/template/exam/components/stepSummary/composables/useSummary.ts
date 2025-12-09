import { SummarySectionData } from "@/components/widgets/wizardSummary/types";
import { ComputedRef } from "vue";
import { computed } from "vue";
import { useCreateExamTemplateStore } from "@/components/views/seb-server/template/exam/composables/store/useCreateExamTemplateStore";
import { getSummaryClientGroups } from "@/components/views/seb-server/template/exam/components/stepSummary/helpers/getSummaryClientGroups";
import { getSummaryNaming } from "@/components/views/seb-server/template/exam/components/stepSummary/helpers/getSummaryNaming";
import { getSummaryIndicators } from "@/components/views/seb-server/template/exam/components/stepSummary/helpers/getSummaryIndicators";
import { getSummarySupervisors } from "@/components/views/seb-server/template/exam/components/stepSummary/helpers/getSummarySupervisors";
import { useSupervisors } from "@/composables/useSupervisors";
import { useConfigurationTemplateNames } from "@/composables/useConfigurationTemplateNames";
import { useClientConfigurationNames } from "@/composables/useClientConfigurationNames";

export const useSummary = (): ComputedRef<SummarySectionData[]> => {
    const examTemplate = useCreateExamTemplateStore().examTemplate;

    const {
        data: supervisors,
        loading: loadingSupervisors,
        error: errorSupervisors,
    } = useSupervisors();

    const {
        data: configurationTemplateNames,
        loading: loadingConfigurationTemplateNames,
        error: errorConfigurationTemplateNames,
    } = useConfigurationTemplateNames();

    const {
        data: clientConfigurationNames,
        loading: loadingClientConfigurationNames,
        error: errorClientConfigurationNames,
    } = useClientConfigurationNames();

    const summary = computed<SummarySectionData[]>(() => {
        const userAccounts =
            loadingSupervisors.value ||
            errorSupervisors.value ||
            !supervisors.value
                ? []
                : supervisors.value;

        const configurationTemplates =
            loadingConfigurationTemplateNames.value ||
            errorConfigurationTemplateNames.value ||
            !configurationTemplateNames.value
                ? []
                : configurationTemplateNames.value;

        const clientConfigurations =
            loadingClientConfigurationNames.value ||
            errorClientConfigurationNames.value ||
            !clientConfigurationNames.value
                ? []
                : clientConfigurationNames.value;

        return [
            getSummaryNaming(
                examTemplate,
                configurationTemplates,
                clientConfigurations,
            ),
            getSummarySupervisors(examTemplate, userAccounts),
            getSummaryIndicators(examTemplate),
            getSummaryClientGroups(examTemplate),
        ];
    });

    return summary;
};
