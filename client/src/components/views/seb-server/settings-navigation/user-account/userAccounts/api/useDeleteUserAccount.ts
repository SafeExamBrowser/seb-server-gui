import type { Ref } from "vue";
import { ref } from "vue";
import { deleteUserAccount } from "@/services/seb-server/userAccountService";
import type { UserAccountResponse } from "@/models/userAccount";

export const useDeleteUserAccount = (
    userAccounts: Ref<UserAccountResponse | undefined>,
) => {
    const loading = ref(false);
    const error = ref<string>();

    const removeUserAccount = async (uuid: string): Promise<boolean> => {
        loading.value = true;
        error.value = undefined;

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
            error.value = err instanceof Error ? err.message : "Unknown error";
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
            error.value = "Invalid user account identifier.";
            return false;
        }

        return removeUserAccount(uuid);
    };

    return {
        removeUserAccount,
        removeUserAccountFromItem,
        loading,
        error,
    };
};
