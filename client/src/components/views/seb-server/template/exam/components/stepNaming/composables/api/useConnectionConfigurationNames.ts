import { useFetch } from "@/components/views/seb-server/template/exam/composables/api/useFetch";
import { getConnectionConfigurationNamesActive } from "@/services/seb-server/api-services/configurationService";

export const useConnectionConfigurationNames = () =>
    useFetch(() => getConnectionConfigurationNamesActive());
