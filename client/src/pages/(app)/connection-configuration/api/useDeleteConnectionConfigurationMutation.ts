import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getSebClientConfigsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { EntityProcessingReport } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { ConnectionConfigurationPage } from "@/models/connectionConfiguration.ts";
import { entityProcessingReportToAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import { deleteConnectionConfiguration } from "@/services/seb-server/connectionConfigurationService.ts";

const listKey = () =>
    getSebClientConfigsQueryKey({ client: heySebServerClient });

export const useDeleteConnectionConfigurationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<EntityProcessingReport, AppError | Error, string>({
        mutationFn: async (modelId: string) => {
            const report = await deleteConnectionConfiguration(modelId);
            const reportError = entityProcessingReportToAppError(report);
            if (reportError) {
                throw reportError;
            }
            return report;
        },
        onSuccess: (_data, modelId) => {
            queryClient.setQueriesData<ConnectionConfigurationPage>(
                { queryKey: listKey() },
                (page) =>
                    page
                        ? {
                              ...page,
                              content: page.content?.filter(
                                  (config) => String(config.id) !== modelId,
                              ),
                          }
                        : page,
            );
            void queryClient.invalidateQueries({ queryKey: listKey() });
        },
    });
};
