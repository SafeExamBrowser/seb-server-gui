import { computed } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { registerUserAccount } from "@/services/seb-server/userAccountService.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import type { UserAccountCreateRequest } from "@/models/userAccount.ts";

export const useRegisterUserAccount = () => {
    const mutation = useMutation({
        mutationFn: (body: UserAccountCreateRequest) =>
            registerUserAccount(body),
    });

    return {
        register: (body: UserAccountCreateRequest) =>
            mutation.mutateAsync(body),
        data: mutation.data,
        isPending: mutation.isPending,
        error: computed(() =>
            mutation.error.value ? toAppError(mutation.error.value) : undefined,
        ),
    };
};
