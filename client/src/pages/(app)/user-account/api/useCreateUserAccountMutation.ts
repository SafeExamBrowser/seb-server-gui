import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { UserAccountCreateRequest } from "@/models/userAccount.ts";
import { createUserAccount } from "@/services/seb-server/userAccountService.ts";

export const useCreateUserAccountMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: UserAccountCreateRequest) => createUserAccount(body),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: getUserAccountsQueryKey({
                    client: heySebServerClient,
                }),
            }),
    });
};
