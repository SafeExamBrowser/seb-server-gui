import { useFetch } from "@/composables/useFetch.ts";
import { getConnectionConfigurationsActive } from "@/services/seb-server/connectionConfigurationInfoService.ts";

export const useConnectionConfigurations = () =>
    useFetch(() => getConnectionConfigurationsActive());
