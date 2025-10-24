import { createExamTemplate } from "@/services/seb-server/api-services/examTemplateService";
import { ref } from "vue";
import { ExamTemplate } from "@/models/seb-server/examTemplate";

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
