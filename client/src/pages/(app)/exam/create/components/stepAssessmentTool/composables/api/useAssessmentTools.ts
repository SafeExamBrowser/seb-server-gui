import { useFetch } from "@/composables/useFetch.ts";
import { getAssessmentToolsActive } from "@/services/seb-server/assessmentToolInfoService.ts";

export const useAssessmentTools = () =>
    useFetch(() => getAssessmentToolsActive(), { immediate: true });
