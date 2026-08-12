import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getExamTemplatesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { copyExamTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useCopyExamTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (modelId: string) => copyExamTemplate(modelId),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: getExamTemplatesQueryKey({
                    client: heySebServerClient,
                }),
            });
        },
    });
};
