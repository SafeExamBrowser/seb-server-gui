import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { EntityProcessingReport } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { UserAccountPage } from "@/models/userAccount.ts";
import { entityProcessingReportToAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import { deleteUserAccount } from "@/services/seb-server/userAccountService.ts";

const listKey = () => getUserAccountsQueryKey({ client: heySebServerClient });

export const useDeleteUserAccountMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<EntityProcessingReport, AppError | Error, string>({
        mutationFn: async (uuid: string) => {
            const report = await deleteUserAccount(uuid);
            const reportError = entityProcessingReportToAppError(report);
            if (reportError) {
                throw reportError;
            }
            return report;
        },
        onSuccess: (_data, uuid) => {
            queryClient.setQueriesData<UserAccountPage>(
                { queryKey: listKey() },
                (page) =>
                    page
                        ? {
                              ...page,
                              content: page.content?.filter(
                                  (account) => account.uuid !== uuid,
                              ),
                          }
                        : page,
            );
            void queryClient.invalidateQueries({ queryKey: listKey() });
        },
    });
};
