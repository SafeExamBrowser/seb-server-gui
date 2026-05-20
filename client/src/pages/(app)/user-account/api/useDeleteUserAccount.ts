import { useMutation } from "@/composables/useMutation.ts";
import { deleteUserAccount } from "@/services/seb-server/userAccountService.ts";

export const useDeleteUserAccount = () => {
    const {
        mutateData: removeUserAccount,
        error,
        loading,
    } = useMutation(async (uuid: string) => {
        const response = await deleteUserAccount(uuid);

        if (response === null) {
            throw new Error("Failed to delete user account.");
        }
    });

    const removeUserAccountFromItem = async (item: Record<string, unknown>) => {
        const uuid = item.uuid;

        if (typeof uuid !== "string") {
            throw new Error(
                "useDeleteUserAccount: row item is missing a string uuid",
            );
        }

        await removeUserAccount(uuid);
    };

    return {
        removeUserAccount,
        removeUserAccountFromItem,
        error,
        loading,
    };
};
