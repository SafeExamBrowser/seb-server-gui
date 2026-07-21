import { useMutation } from "@tanstack/vue-query";

import { testAssessmentTool } from "@/services/seb-server/assessmentToolService.ts";

export const useTestAssessmentToolMutation = () =>
    useMutation({
        mutationFn: (modelId: number) => testAssessmentTool(modelId),
    });
