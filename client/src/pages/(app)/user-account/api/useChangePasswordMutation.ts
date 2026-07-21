import { useMutation } from "@tanstack/vue-query";

import type { UserAccountPasswordChange } from "@/models/userAccount.ts";
import { changeUserAccountPassword } from "@/services/seb-server/userAccountService.ts";

export const useChangePasswordMutation = () =>
    useMutation({
        mutationFn: (body: UserAccountPasswordChange) =>
            changeUserAccountPassword(body),
    });
