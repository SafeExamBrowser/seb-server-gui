import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getExamTemplateByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { deleteIndicatorTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useDeleteIndicatorTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            examTemplateId,
            indicatorId,
        }: {
            examTemplateId: number;
            indicatorId: number;
        }) => deleteIndicatorTemplate(examTemplateId, indicatorId),
        onSuccess: (_result, { examTemplateId }) => {
            void queryClient.invalidateQueries({
                queryKey: getExamTemplateByIdQueryKey({
                    client: heySebServerClient,
                    path: { modelId: String(examTemplateId) },
                }),
            });
        },
    });
};
