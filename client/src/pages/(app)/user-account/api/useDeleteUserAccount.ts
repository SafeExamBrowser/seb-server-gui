import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { deleteUserAccount } from "@/services/seb-server/userAccountService.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type { UserAccountPage } from "@/models/userAccount.ts";

const listKey = () => getUserAccountsQueryKey({ client: heySebServerClient });

export const useDeleteUserAccount = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (uuid: string) => deleteUserAccount(uuid),
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
            queryClient.invalidateQueries({ queryKey: listKey() });
        },
    });

    return {
        removeUserAccount: (uuid: string) => mutation.mutateAsync(uuid),
        isPending: mutation.isPending,
        error: computed(() => toAppErrorOrUndefined(mutation.error.value)),
    };
};
