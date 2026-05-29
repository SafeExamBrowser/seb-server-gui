import { computed } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { changeUserAccountPassword } from "@/services/seb-server/userAccountService.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type { UserAccountPasswordChange } from "@/models/userAccount.ts";

export const useChangePassword = () => {
    const mutation = useMutation({
        mutationFn: (body: UserAccountPasswordChange) =>
            changeUserAccountPassword(body),
    });

    return {
        changePassword: (body: UserAccountPasswordChange) =>
            mutation.mutateAsync(body),
        data: mutation.data,
        isPending: mutation.isPending,
        error: computed(() => toAppErrorOrUndefined(mutation.error.value)),
    };
};
