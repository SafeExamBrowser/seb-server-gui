import { useMutation } from "@tanstack/vue-query";
import { changeUserAccountPassword } from "@/services/seb-server/userAccountService.ts";
import type { UserAccountPasswordChange } from "@/models/userAccount.ts";

export const useChangePasswordMutation = () =>
    useMutation({
        mutationFn: (body: UserAccountPasswordChange) =>
            changeUserAccountPassword(body),
    });
