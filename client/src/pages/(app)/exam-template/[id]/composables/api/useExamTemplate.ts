import { useFetch } from "@/composables/useFetch.ts";
import { getExamTemplate } from "@/services/seb-server/examTemplateService.ts";
import { apiIndicatorSchema } from "@/services/seb-server/examTemplateIndicatorService.ts";

export const useExamTemplate = (id: number | undefined) =>
    useFetch(
        async () => {
            const template = await getExamTemplate(String(id));
            return {
                ...template,
                indicators: template.indicatorTemplates.map((api) =>
                    apiIndicatorSchema.parse(api),
                ),
            };
        },
        { immediate: id !== undefined },
    );
