import { useMutation } from "@tanstack/vue-query";
import { registerUserAccount } from "@/services/seb-server/userAccountService.ts";
import type { UserAccountCreateRequest } from "@/models/userAccount.ts";

export const useRegisterUserAccountMutation = () =>
    useMutation({
        mutationFn: (body: UserAccountCreateRequest) =>
            registerUserAccount(body),
    });
