import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { createUserAccount } from "@/services/seb-server/userAccountService.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type { UserAccountCreateRequest } from "@/models/userAccount.ts";

export const useCreateUserAccount = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (body: UserAccountCreateRequest) => createUserAccount(body),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: getUserAccountsQueryKey({
                    client: heySebServerClient,
                }),
            }),
    });

    return {
        create: (body: UserAccountCreateRequest) => mutation.mutateAsync(body),
        data: mutation.data,
        isPending: mutation.isPending,
        error: computed(() => toAppErrorOrUndefined(mutation.error.value)),
    };
};
