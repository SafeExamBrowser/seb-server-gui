import { computed } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { changeUserAccountPassword } from "@/services/seb-server/userAccountService.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import type { UserAccountPasswordChange } from "@/models/userAccount.ts";

export const useChangePassword = () => {
    const mutation = useMutation({ mutationFn: changeUserAccountPassword });

    return {
        changePassword: (body: UserAccountPasswordChange) =>
            mutation.mutateAsync(body),
        data: mutation.data,
        loading: mutation.isPending,
        error: computed(() =>
            mutation.error.value ? toAppError(mutation.error.value) : undefined,
        ),
    };
};
