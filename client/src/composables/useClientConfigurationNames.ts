import { useFetch } from "@/composables/useFetch";
import { getConnectionConfigurationNamesActive } from "@/services/seb-server/connectionConfigurationInfoService.ts";

export const useClientConfigurationNames = () =>
    useFetch(() => getConnectionConfigurationNamesActive(), {
        immediate: true,
    });
