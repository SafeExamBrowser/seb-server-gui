import { useFetch } from "@/composables/useFetch.ts";
import { getExamTemplateNames } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplateNames = () =>
    useFetch(() => getExamTemplateNames(), { immediate: true });
