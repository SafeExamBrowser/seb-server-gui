import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getLmsSetupsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { AssessmentToolCreateRequest } from "@/models/assessmentTool.ts";
import { createAssessmentTool } from "@/services/seb-server/assessmentToolService.ts";

export const useCreateAssessmentToolMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: AssessmentToolCreateRequest) =>
            createAssessmentTool(body),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: getLmsSetupsQueryKey({
                    client: heySebServerClient,
                }),
            }),
    });
};
