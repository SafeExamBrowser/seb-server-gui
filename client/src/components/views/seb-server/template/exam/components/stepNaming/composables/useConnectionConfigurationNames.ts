import { useFetch } from "./useFetch";
import { getConnectionConfigurationNamesActive } from "@/services/seb-server/api-services/configurationService";

export const useConnectionConfigurationNames = () =>
    useFetch(() => getConnectionConfigurationNamesActive());
