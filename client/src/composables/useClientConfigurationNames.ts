import { useFetch } from "@/composables/useFetch";
import { getConnectionConfigurationNamesActive } from "@/services/seb-server/connectionConfigurationService.ts";
import { onMounted } from "vue";

export const useClientConfigurationNames = () => {
    const clientConfigurationNamesFetch = useFetch(() =>
        getConnectionConfigurationNamesActive(),
    );
    onMounted(clientConfigurationNamesFetch.fetchData);
    return clientConfigurationNamesFetch;
};
