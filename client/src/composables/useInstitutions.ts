import { useFetch } from "@/composables/useFetch";
import { getInstitutions } from "@/services/seb-server/institutionInfoService";

export const useInstitutions = () =>
    useFetch(() => getInstitutions(), { immediate: true });
