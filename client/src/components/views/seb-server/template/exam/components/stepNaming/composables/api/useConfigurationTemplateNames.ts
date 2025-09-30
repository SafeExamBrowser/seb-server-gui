import { getConfigurationTemplateNamesActive } from "@/services/seb-server/api-services/configurationNodeService";
import { useFetch } from "@/components/views/seb-server/template/exam/composables/api/useFetch";

export const useConfigurationTemplateNames = () =>
    useFetch(() => getConfigurationTemplateNamesActive());
