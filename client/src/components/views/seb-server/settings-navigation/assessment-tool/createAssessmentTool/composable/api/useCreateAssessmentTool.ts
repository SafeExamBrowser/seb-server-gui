import { ref } from "vue";
import { createAssessmentTool } from "@/services/seb-server/assessmentToolService";
import type {
    AssessmentTool,
    CreateAssessmentToolPar,
} from "@/models/seb-server/assessmentTool";

export const useCreateAssessmentTool = () => {
    const loading = ref(false);
    const error = ref<string | undefined>(undefined);

    const submit = async (
        params: CreateAssessmentToolPar,
    ): Promise<AssessmentTool | null> => {
        loading.value = true;
        error.value = undefined;
        try {
            return await createAssessmentTool(params);
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
            return null;
        } finally {
            loading.value = false;
        }
    };

    return { loading, error, submit };
};
