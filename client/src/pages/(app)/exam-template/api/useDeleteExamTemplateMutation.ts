import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getExamTemplatesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { EntityProcessingReport } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { entityProcessingReportToAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import { deleteExamTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useDeleteExamTemplateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<EntityProcessingReport, AppError | Error, string>({
        mutationFn: async (modelId: string) => {
            const report = await deleteExamTemplate(modelId);
            const reportError = entityProcessingReportToAppError(report);
            if (reportError) {
                throw reportError;
            }
            return report;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: getExamTemplatesQueryKey({
                    client: heySebServerClient,
                }),
            });
        },
    });
};
