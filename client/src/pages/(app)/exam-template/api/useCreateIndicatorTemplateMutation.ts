import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getExamTemplateByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { Indicator } from "@/models/examTemplate.ts";
import { createIndicatorTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useCreateIndicatorTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            examTemplateId,
            indicator,
        }: {
            examTemplateId: number;
            indicator: Indicator;
        }) => createIndicatorTemplate(examTemplateId, indicator),
        onSuccess: (_created, { examTemplateId }) => {
            void queryClient.invalidateQueries({
                queryKey: getExamTemplateByIdQueryKey({
                    client: heySebServerClient,
                    path: { modelId: String(examTemplateId) },
                }),
            });
        },
    });
};
