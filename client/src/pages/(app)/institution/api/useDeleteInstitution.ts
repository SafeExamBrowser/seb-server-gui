import { useMutation } from "@/composables/useMutation.ts";
import { deleteInstitution } from "@/services/seb-server/institutionService.ts";

export const useDeleteInstitution = () => {
    const {
        mutateData: removeInstitution,
        error,
        loading,
    } = useMutation(async (id: number) => {
        const response = await deleteInstitution(id);

        if (response === null) {
            throw new Error("Failed to delete institution.");
        }
    });

    const removeInstitutionFromItem = async (item: Record<string, unknown>) => {
        const id = item.id;

        if (typeof id !== "number") {
            throw new Error(
                "useDeleteInstitution: row item is missing a numeric id",
            );
        }

        await removeInstitution(id);
    };

    return {
        removeInstitution,
        removeInstitutionFromItem,
        error,
        loading,
    };
};
