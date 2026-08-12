import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getExamTemplateByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { IndicatorExisting } from "@/models/examTemplate.ts";
import { saveIndicatorTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useSaveIndicatorTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            examTemplateId,
            indicator,
        }: {
            examTemplateId: number;
            indicator: IndicatorExisting;
        }) => saveIndicatorTemplate(examTemplateId, indicator),
        onSuccess: (_saved, { examTemplateId }) => {
            void queryClient.invalidateQueries({
                queryKey: getExamTemplateByIdQueryKey({
                    client: heySebServerClient,
                    path: { modelId: String(examTemplateId) },
                }),
            });
        },
    });
};
