import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getLmsSetupsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { EntityProcessingReport } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { AssessmentToolPage } from "@/models/assessmentTool.ts";
import { entityProcessingReportToAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import { deleteAssessmentTool } from "@/services/seb-server/assessmentToolService.ts";

const listKey = () => getLmsSetupsQueryKey({ client: heySebServerClient });

export const useDeleteAssessmentToolMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<EntityProcessingReport, AppError | Error, string>({
        mutationFn: async (modelId: string) => {
            const report = await deleteAssessmentTool(modelId);
            const reportError = entityProcessingReportToAppError(report);
            if (reportError) {
                throw reportError;
            }
            return report;
        },
        onSuccess: (_data, modelId) => {
            queryClient.setQueriesData<AssessmentToolPage>(
                { queryKey: listKey() },
                (page) =>
                    page
                        ? {
                              ...page,
                              content: page.content?.filter(
                                  (tool) => String(tool.id) !== modelId,
                              ),
                          }
                        : page,
            );
            void queryClient.invalidateQueries({ queryKey: listKey() });
        },
    });
};
