import { useFetch } from "@/composables/useFetch";
import { getConnectionConfigurationNamesActive } from "@/services/seb-server/api-services/configurationService";

export const useClientConfigurationNames = () =>
    useFetch(() => getConnectionConfigurationNamesActive());
