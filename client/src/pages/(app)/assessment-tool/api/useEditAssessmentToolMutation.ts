import { useMutation, useQueryClient } from "@tanstack/vue-query";

import {
    getLmsSetupByIdQueryKey,
    getLmsSetupsQueryKey,
} from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type {
    AssessmentTool,
    AssessmentToolEditRequest,
} from "@/models/assessmentTool.ts";
import { editAssessmentTool } from "@/services/seb-server/assessmentToolService.ts";

export const useEditAssessmentToolMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: AssessmentToolEditRequest) =>
            editAssessmentTool(body),
        onSuccess: (data: AssessmentTool) => {
            queryClient.invalidateQueries({
                queryKey: getLmsSetupsQueryKey({
                    client: heySebServerClient,
                }),
            });

            queryClient.setQueryData(
                getLmsSetupByIdQueryKey({
                    client: heySebServerClient,
                    path: { modelId: String(data.id) },
                }),
                data,
            );
        },
    });
};
