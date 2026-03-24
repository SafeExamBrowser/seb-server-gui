import type { Ref } from "vue";
import { ref } from "vue";
import {
    activateUserAccount,
    deactivateUserAccount,
} from "@/services/seb-server/userAccountService";
import type { UserAccount, UserAccountResponse } from "@/models/userAccount";

export const useToggleUserAccountStatus = (
    userAccounts: Ref<UserAccountResponse | undefined>,
) => {
    const loading = ref(false);
    const error = ref<string>();

    const toggleUserAccountStatus = async (
        uuid: string,
        currentlyActive: boolean,
    ): Promise<boolean> => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = currentlyActive
                ? await deactivateUserAccount(uuid)
                : await activateUserAccount(uuid);

            if (response === null) {
                throw new Error("Failed to change user account status.");
            }

            if (userAccounts.value?.content) {
                userAccounts.value.content = userAccounts.value.content.map(
                    (user: UserAccount) =>
                        user.uuid === uuid
                            ? { ...user, active: !currentlyActive }
                            : user,
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

    const toggleUserAccountStatusFromItem = async (
        item: Record<string, unknown>,
    ): Promise<boolean> => {
        const uuid = item.uuid;
        const active = item.active;

        if (typeof uuid !== "string") {
            error.value = "Invalid user account identifier.";
            return false;
        }

        if (typeof active !== "boolean") {
            error.value = "Invalid user account status.";
            return false;
        }

        return toggleUserAccountStatus(uuid, active);
    };

    return {
        toggleUserAccountStatus,
        toggleUserAccountStatusFromItem,
        loading,
        error,
    };
};
