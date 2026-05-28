import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
    getUserAccountByIdQueryKey,
    getUserAccountsQueryKey,
} from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { editUserAccount } from "@/services/seb-server/userAccountService.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import type { UserAccount } from "@/models/userAccount.ts";

export const useEditUserAccount = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: editUserAccount,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: getUserAccountsQueryKey({
                    client: heySebServerClient,
                }),
            });
            queryClient.invalidateQueries({
                queryKey: getUserAccountByIdQueryKey({
                    client: heySebServerClient,
                    path: { modelId: data.uuid },
                }),
            });
        },
    });

    return {
        save: (body: UserAccount) => mutation.mutateAsync(body),
        data: mutation.data,
        loading: mutation.isPending,
        error: computed(() =>
            mutation.error.value ? toAppError(mutation.error.value) : undefined,
        ),
    };
};
