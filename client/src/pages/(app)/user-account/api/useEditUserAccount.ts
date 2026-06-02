import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
    getUserAccountByIdQueryKey,
    getUserAccountsQueryKey,
} from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { editUserAccount } from "@/services/seb-server/userAccountService.ts";
import { currentUserQueryKey } from "@/composables/useCurrentUser.ts";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type { UserAccount } from "@/models/userAccount.ts";

export const useEditUserAccount = () => {
    const queryClient = useQueryClient();
    const userAccountStore = useUserAccountStore();
    const mutation = useMutation({
        mutationFn: (body: UserAccount) => editUserAccount(body),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: getUserAccountsQueryKey({
                    client: heySebServerClient,
                }),
            });

            queryClient.setQueryData(
                getUserAccountByIdQueryKey({
                    client: heySebServerClient,
                    path: { modelId: data.uuid },
                }),
                data,
            );

            if (userAccountStore.userAccount?.uuid === data.uuid) {
                userAccountStore.userAccount = data;
                queryClient.setQueryData(currentUserQueryKey(), data);
            }
        },
    });

    return {
        save: (body: UserAccount) => mutation.mutateAsync(body),
        data: mutation.data,
        isPending: mutation.isPending,
        error: computed(() => toAppErrorOrUndefined(mutation.error.value)),
    };
};
