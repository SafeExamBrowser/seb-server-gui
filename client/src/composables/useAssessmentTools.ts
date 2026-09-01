import { useFetch } from "@/composables/useFetch.ts";
import { getAssessmentToolsActive } from "@/services/seb-server/assessmentToolInfoService.ts";

export const useAssessmentTools = (options?: { immediate?: boolean }) =>
    useFetch(() => getAssessmentToolsActive(), {
        immediate: options?.immediate ?? true,
    });
