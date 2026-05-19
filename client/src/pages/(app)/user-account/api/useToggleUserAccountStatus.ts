import { notify } from "@/services/notifications/notify.ts";
import type { Ref } from "vue";
import { ref } from "vue";
import type { UserAccountResponse } from "@/models/userAccount.ts";
import {
    activateUserAccount,
    deactivateUserAccount,
} from "@/services/seb-server/userAccountService.ts";

export const useToggleUserAccountStatus = (
    userAccounts: Ref<UserAccountResponse | undefined>,
) => {
    const loading = ref(false);

    const changeUserAccountStatus = async (
        uuid: string,
        active: boolean,
    ): Promise<boolean> => {
        loading.value = true;

        try {
            const response = active
                ? await deactivateUserAccount(uuid)
                : await activateUserAccount(uuid);

            if (response === null) {
                throw new Error("Failed to change user account status.");
            }

            if (userAccounts.value?.content) {
                userAccounts.value.content = userAccounts.value.content.map(
                    (user) =>
                        user.uuid === uuid
                            ? {
                                  ...user,
                                  active: !active,
                              }
                            : user,
                );
            }

            return true;
        } catch (err) {
            notify.serverError(err, { contextLabel: "useraccount.status" });
            return false;
        } finally {
            loading.value = false;
        }
    };

    const changeUserAccountStatusFromItem = async (
        item: Record<string, unknown>,
    ): Promise<boolean> => {
        const uuid = item.uuid;
        const active = item.active;

        if (typeof uuid !== "string") {
            notify.serverError(new Error("Invalid user account identifier."));
            return false;
        }

        if (typeof active !== "boolean") {
            notify.serverError(new Error("Invalid user account status."));
            return false;
        }

        return changeUserAccountStatus(uuid, active);
    };

    return {
        changeUserAccountStatus,
        toggleUserAccountStatusFromItem: changeUserAccountStatusFromItem,
        loading,
    };
};
