import { getConfigurationTemplateNamesActive } from "@/services/seb-server/configurationNodeService";
import { useFetch } from "@/composables/useFetch";
import { onMounted } from "vue";

export const useConfigurationTemplateNames = () => {
    const configurationTemplateNamesFetch = useFetch(() =>
        getConfigurationTemplateNamesActive(),
    );
    onMounted(configurationTemplateNamesFetch.fetchData);
    return configurationTemplateNamesFetch;
};
