import { useFetch } from "@/composables/useFetch.ts";
import { getExamTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplate = (id: string) =>
    useFetch(() => getExamTemplate(id), { immediate: true });
