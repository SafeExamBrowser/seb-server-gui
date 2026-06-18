import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getInstitutionsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { deleteInstitution } from "@/services/seb-server/institutionService.ts";
import { entityProcessingReportToAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import type { EntityProcessingReport } from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const useDeleteInstitutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<EntityProcessingReport, AppError | Error, string>({
        mutationFn: async (modelId: string) => {
            const report = await deleteInstitution(modelId);
            const reportError = entityProcessingReportToAppError(report);
            if (reportError) {
                throw reportError;
            }
            return report;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: getInstitutionsQueryKey({
                    client: heySebServerClient,
                }),
            });
        },
    });
};
