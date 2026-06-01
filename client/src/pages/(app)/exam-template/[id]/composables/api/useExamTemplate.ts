import { useFetch } from "@/composables/useFetch.ts";
import { getExamTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplate = (id: number | undefined) =>
    useFetch(
        async () => {
            const template = await getExamTemplate(String(id));
            return {
                ...template,
                indicators: template.indicatorTemplates,
            };
        },
        { immediate: id !== undefined },
    );
