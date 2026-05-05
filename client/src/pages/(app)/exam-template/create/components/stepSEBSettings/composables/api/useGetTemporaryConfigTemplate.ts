import { useFetch } from "@/composables/useFetch.ts";
import { createTemporaryConfigurationTemplate } from "@/services/seb-server/examTemplateService.ts";
import { getConfigurationTemplateName } from "@/services/seb-server/configurationNodeService.ts";
import { useStepNamingStore } from "@/pages/(app)/exam-template/create/components/stepNaming/composables/store/useStepNamingStore.ts";

const stepNamingStore = useStepNamingStore();

export const getTemporaryConfigTemplate = () => {
    return useFetch(
        () => {
            // if temporary configuration template is not created yet create one
            if (!stepNamingStore.configurationTemplate) {
                return createTemporaryConfigurationTemplate();
            } else {
                // otherwise just request the existing one
                return getConfigurationTemplateName(
                    stepNamingStore.configurationTemplate,
                );
            }
        },
        { immediate: true },
    );
};
