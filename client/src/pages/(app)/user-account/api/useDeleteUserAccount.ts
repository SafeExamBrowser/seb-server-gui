import { notify } from "@/services/notifications/notify.ts";
import type { Ref } from "vue";
import { ref } from "vue";
import { deleteUserAccount } from "@/services/seb-server/userAccountService.ts";
import type { UserAccountResponse } from "@/models/userAccount.ts";

export const useDeleteUserAccount = (
    userAccounts: Ref<UserAccountResponse | undefined>,
) => {
    const loading = ref(false);

    const removeUserAccount = async (uuid: string): Promise<boolean> => {
        loading.value = true;

        try {
            const response = await deleteUserAccount(uuid);

            if (response === null) {
                throw new Error("Failed to delete user account.");
            }

            if (userAccounts.value?.content) {
                userAccounts.value.content = userAccounts.value.content.filter(
                    (user) => user.uuid !== uuid,
                );
            }

            return true;
        } catch (err) {
            notify.serverError(err, { contextLabel: "useraccount" });
            return false;
        } finally {
            loading.value = false;
        }
    };

    const removeUserAccountFromItem = async (
        item: Record<string, unknown>,
    ): Promise<boolean> => {
        const uuid = item.uuid;

        if (typeof uuid !== "string") {
            notify.serverError(new Error("Invalid User Account identifier."));
            return false;
        }

        return removeUserAccount(uuid);
    };

    return {
        removeUserAccount,
        removeUserAccountFromItem,
        loading,
    };
};
