import { useFetch } from "@/composables/useFetch";
import { getConnectionConfigurationNamesActive } from "@/services/seb-server/connectionConfigurationService.ts";

export const useClientConfigurationNames = () =>
    useFetch(() => getConnectionConfigurationNamesActive());
