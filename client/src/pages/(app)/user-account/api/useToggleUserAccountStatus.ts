import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    activateUserAccount,
    deactivateUserAccount,
} from "@/services/seb-server/userAccountService.ts";
import { toAppError } from "@/services/errors/toAppError.ts";

export const useToggleUserAccountStatus = () => {
    const queryClient = useQueryClient();
    const invalidateList = () =>
        queryClient.invalidateQueries({
            queryKey: getUserAccountsQueryKey({ client: heySebServerClient }),
        });

    const activate = useMutation({
        mutationFn: activateUserAccount,
        onSuccess: invalidateList,
    });
    const deactivate = useMutation({
        mutationFn: deactivateUserAccount,
        onSuccess: invalidateList,
    });

    const changeUserAccountStatus = (uuid: string, active: boolean) => {
        const mutation = active ? deactivate : activate;
        return mutation.mutateAsync(uuid);
    };

    return {
        changeUserAccountStatus,
        loading: computed(
            () => activate.isPending.value || deactivate.isPending.value,
        ),
        error: computed(() => {
            const err = activate.error.value ?? deactivate.error.value;
            return err ? toAppError(err) : undefined;
        }),
    };
};
