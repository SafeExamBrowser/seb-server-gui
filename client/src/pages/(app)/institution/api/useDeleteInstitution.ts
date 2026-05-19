import { notify } from "@/services/notifications/notify.ts";
import { ref } from "vue";
import { deleteInstitution } from "@/services/seb-server/institutionService.ts";

export const useDeleteInstitution = () => {
    const loading = ref(false);

    const removeInstitution = async (id: number): Promise<boolean> => {
        loading.value = true;

        try {
            const response = await deleteInstitution(id);

            if (response === null) {
                throw new Error("Failed to delete institution.");
            }

            return true;
        } catch (err) {
            notify.serverError(err, { contextLabel: "institution" });
            return false;
        } finally {
            loading.value = false;
        }
    };

    const removeInstitutionFromItem = async (
        item: Record<string, unknown>,
    ): Promise<boolean> => {
        const id = item.id;

        if (typeof id !== "number") {
            throw new Error(
                "useDeleteInstitution: row item is missing a numeric id",
            );
        }

        return removeInstitution(id);
    };

    return {
        removeInstitution,
        removeInstitutionFromItem,
        loading,
    };
};
