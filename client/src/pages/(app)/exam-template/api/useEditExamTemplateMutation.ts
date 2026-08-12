import { useMutation, useQueryClient } from "@tanstack/vue-query";

import {
    getExamTemplateByIdQueryKey,
    getExamTemplatesQueryKey,
} from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { ExamTemplate } from "@/models/examTemplate.ts";
import { editExamTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useEditExamTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: ExamTemplate) => editExamTemplate(body),
        onSuccess: (examTemplate) => {
            void queryClient.invalidateQueries({
                queryKey: getExamTemplatesQueryKey({
                    client: heySebServerClient,
                }),
            });
            void queryClient.invalidateQueries({
                queryKey: getExamTemplateByIdQueryKey({
                    client: heySebServerClient,
                    path: { modelId: String(examTemplate.id) },
                }),
            });
        },
    });
};
