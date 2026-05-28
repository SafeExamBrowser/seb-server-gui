import { computed } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { registerUserAccount } from "@/services/seb-server/userAccountService.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import type { UserAccountCreateRequest } from "@/models/userAccount.ts";

export const useRegisterUserAccount = () => {
    const mutation = useMutation({ mutationFn: registerUserAccount });

    return {
        register: (body: UserAccountCreateRequest) =>
            mutation.mutateAsync(body),
        data: mutation.data,
        loading: mutation.isPending,
        error: computed(() =>
            mutation.error.value ? toAppError(mutation.error.value) : undefined,
        ),
    };
};
