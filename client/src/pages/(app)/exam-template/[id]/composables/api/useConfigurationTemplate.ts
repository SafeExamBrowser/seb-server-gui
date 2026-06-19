import { useFetch } from "@/composables/useFetch";
import { getConfigurationTemplate } from "@/services/seb-server/configurationNodeService";

export const useConfigurationTemplate = (
    configurationTemplateId: number | undefined,
) =>
    useFetch(() => getConfigurationTemplate(String(configurationTemplateId)), {
        immediate: configurationTemplateId !== undefined,
    });
