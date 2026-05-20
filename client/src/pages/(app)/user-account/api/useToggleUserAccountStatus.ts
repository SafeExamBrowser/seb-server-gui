import { useMutation } from "@/composables/useMutation.ts";
import {
    activateUserAccount,
    deactivateUserAccount,
} from "@/services/seb-server/userAccountService.ts";

export const useToggleUserAccountStatus = () => {
    const {
        mutateData: changeUserAccountStatus,
        error,
        loading,
    } = useMutation(async (uuid: string, active: boolean) => {
        const response = active
            ? await deactivateUserAccount(uuid)
            : await activateUserAccount(uuid);

        if (response === null) {
            throw new Error("Failed to change user account status.");
        }
    });

    const changeUserAccountStatusFromItem = async (
        item: Record<string, unknown>,
    ) => {
        const uuid = item.uuid;
        const active = item.active;

        if (typeof uuid !== "string") {
            throw new Error(
                "useToggleUserAccountStatus: row item is missing a string uuid",
            );
        }

        if (typeof active !== "boolean") {
            throw new Error(
                "useToggleUserAccountStatus: row item is missing a boolean active flag",
            );
        }

        await changeUserAccountStatus(uuid, active);
    };

    return {
        changeUserAccountStatus,
        toggleUserAccountStatusFromItem: changeUserAccountStatusFromItem,
        error,
        loading,
    };
};
