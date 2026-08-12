import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getExamTemplatesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { ExamTemplateCreate } from "@/models/examTemplate.ts";
import { fullCreateExamTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useCreateExamTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: ExamTemplateCreate) => fullCreateExamTemplate(body),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: getExamTemplatesQueryKey({
                    client: heySebServerClient,
                }),
            });
        },
    });
};
