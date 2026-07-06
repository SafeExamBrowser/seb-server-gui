import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    activateUserAccount,
    deactivateUserAccount,
} from "@/services/seb-server/userAccountService.ts";
import { entityProcessingReportToAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import type { UserAccountPage } from "@/models/userAccount.ts";
import type { EntityProcessingReport } from "@/api/seb-server/generated/hey-api/types.gen.ts";

const listKey = () => getUserAccountsQueryKey({ client: heySebServerClient });

const flipActiveInList =
    (uuid: string, isActive: boolean) =>
    (page: UserAccountPage | undefined): UserAccountPage | undefined =>
        page
            ? {
                  ...page,
                  content: page.content?.map((account) =>
                      account.uuid === uuid
                          ? { ...account, active: isActive }
                          : account,
                  ),
              }
            : page;

const throwOnReportErrors = async (
    report: Promise<EntityProcessingReport>,
): Promise<EntityProcessingReport> => {
    const resolved = await report;
    const reportError = entityProcessingReportToAppError(resolved);
    if (reportError) {
        throw reportError;
    }
    return resolved;
};

export const useToggleUserAccountStatusMutation = () => {
    const queryClient = useQueryClient();

    const activate = useMutation<
        EntityProcessingReport,
        AppError | Error,
        string
    >({
        mutationFn: (uuid: string) =>
            throwOnReportErrors(activateUserAccount(uuid)),
        onSuccess: (_data, uuid) => {
            queryClient.setQueriesData<UserAccountPage>(
                { queryKey: listKey() },
                flipActiveInList(uuid, true),
            );
            void queryClient.invalidateQueries({ queryKey: listKey() });
        },
    });

    const deactivate = useMutation<
        EntityProcessingReport,
        AppError | Error,
        string
    >({
        mutationFn: (uuid: string) =>
            throwOnReportErrors(deactivateUserAccount(uuid)),
        onSuccess: (_data, uuid) => {
            queryClient.setQueriesData<UserAccountPage>(
                { queryKey: listKey() },
                flipActiveInList(uuid, false),
            );
            void queryClient.invalidateQueries({ queryKey: listKey() });
        },
    });

    const changeUserAccountStatus = (
        uuid: string,
        isCurrentlyActive: boolean,
    ) => {
        activate.reset();
        deactivate.reset();
        const mutation = isCurrentlyActive ? deactivate : activate;
        return mutation.mutateAsync(uuid);
    };

    return {
        changeUserAccountStatus,
        isPending: computed(
            () => activate.isPending.value || deactivate.isPending.value,
        ),
        error: computed(
            () => activate.error.value ?? deactivate.error.value ?? undefined,
        ),
    };
};
