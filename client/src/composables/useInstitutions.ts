import { useFetch } from "@/composables/useFetch";
import { getInstitutions } from "@/services/seb-server/institutionService";

export const useInstitutions = () =>
    useFetch(() => getInstitutions(), { immediate: true });
