import { ref } from "vue";
import { deleteInstitution } from "@/services/seb-server/institutionService.ts";

export const useDeleteInstitution = () => {
    const loading = ref(false);
    const error = ref<string>();

    const removeInstitution = async (id: number): Promise<boolean> => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = await deleteInstitution(id);

            if (response === null) {
                throw new Error("Failed to delete institution.");
            }

            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
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
        error,
    };
};
