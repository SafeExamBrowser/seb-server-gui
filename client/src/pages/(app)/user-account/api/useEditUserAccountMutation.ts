import { useMutation, useQueryClient } from "@tanstack/vue-query";

import {
    getUserAccountByIdQueryKey,
    getUserAccountsQueryKey,
} from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    currentUserQueryOptions,
    useCurrentUserQuery,
} from "@/composables/useCurrentUser.ts";
import { guiAbilitiesQueryOptions } from "@/composables/useGuiAbilities.ts";
import type { UserAccount } from "@/models/userAccount.ts";
import { editUserAccount } from "@/services/seb-server/userAccountService.ts";

export const useEditUserAccountMutation = () => {
    const queryClient = useQueryClient();
    const { data: currentUser } = useCurrentUserQuery();
    return useMutation({
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

            if (currentUser.value?.uuid === data.uuid) {
                queryClient.setQueryData(
                    currentUserQueryOptions().queryKey,
                    data,
                );
                queryClient.invalidateQueries({
                    queryKey: guiAbilitiesQueryOptions().queryKey,
                });
            }
        },
    });
};
