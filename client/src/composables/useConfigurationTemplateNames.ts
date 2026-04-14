import { getConfigurationTemplateNamesActive } from "@/services/seb-server/configurationNodeService";
import { useFetch } from "@/composables/useFetch";

export const useConfigurationTemplateNames = () =>
    useFetch(() => getConfigurationTemplateNamesActive());
