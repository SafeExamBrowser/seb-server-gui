import { useFetch } from "@/composables/useFetch.ts";
import { getExamTemplates } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplates = () =>
    useFetch(() => getExamTemplates({}), { immediate: true });
