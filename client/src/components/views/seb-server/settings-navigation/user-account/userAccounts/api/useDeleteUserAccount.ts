import { ref } from "vue";
import { deleteUserAccount } from "@/services/seb-server/userAccountService";

export const useDeleteUserAccount = () => {
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

            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
            return false;
        } finally {
            loading.value = false;
        }
    };

    return {
        removeUserAccount,
        loading,
        error,
    };
};
