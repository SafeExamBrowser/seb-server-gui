import { getConfigurationTemplateNamesActive } from "@/services/seb-server/api-services/configurationNodeService";
import { useFetch } from "@/composables/useFetch";

export const useConfigurationTemplateNames = () =>
    useFetch(() => getConfigurationTemplateNamesActive());
