import { getConfigurationTemplateNamesActive } from "@/services/seb-server/configurationNodeService";
import { useFetch } from "@/composables/useFetch";

// TODO @andreas: this seems to not be used anymore?
export const useConfigurationTemplateNames = () =>
    useFetch(() => getConfigurationTemplateNamesActive(), {
        immediate: true,
    });
