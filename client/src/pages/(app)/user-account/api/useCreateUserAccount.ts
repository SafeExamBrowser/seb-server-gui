import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { createUserAccount } from "@/services/seb-server/userAccountService.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import type { UserAccountCreateRequest } from "@/models/userAccount.ts";

export const useCreateUserAccount = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: createUserAccount,
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
        loading: mutation.isPending,
        error: computed(() =>
            mutation.error.value ? toAppError(mutation.error.value) : undefined,
        ),
    };
};
