import { getConfigurationTemplateNamesActive } from "@/services/seb-server/api-services/configurationNodeService";
import { useFetch } from "./useFetch";

export const useSebClientTemplateNames = () =>
    useFetch(() => getConfigurationTemplateNamesActive());
