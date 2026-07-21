import { useMutation } from "@tanstack/vue-query";

import type { UserAccountRegisterRequest } from "@/models/userAccount.ts";
import { registerUserAccount } from "@/services/seb-server/userAccountService.ts";

export const useRegisterUserAccountMutation = () =>
    useMutation({
        mutationFn: (body: UserAccountRegisterRequest) =>
            registerUserAccount(body),
    });
