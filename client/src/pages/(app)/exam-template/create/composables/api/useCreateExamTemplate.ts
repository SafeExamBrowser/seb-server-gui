import { createExamTemplate } from "@/services/seb-server/examTemplateService.ts";
import { ref } from "vue";
import { ExamTemplate } from "@/models/seb-server/examTemplate.ts";

export const useCreateExamTemplate = () => {
    const loading = ref(false);
    const error = ref<string>();
    const data = ref<ExamTemplate>();

    const create = async (examTemplate: ExamTemplate) => {
        loading.value = true;

        try {
            data.value = await createExamTemplate(examTemplate);
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
        } finally {
            loading.value = false;
        }
    };

    return {
        create,
        loading,
        error,
        data,
    };
};
