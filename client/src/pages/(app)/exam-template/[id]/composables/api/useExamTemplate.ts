import { useFetch } from "@/composables/useFetch.ts";
import { getExamTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplate = (id: number | undefined) =>
    useFetch(() => getExamTemplate(String(id)), {
        immediate: id !== undefined,
    });
