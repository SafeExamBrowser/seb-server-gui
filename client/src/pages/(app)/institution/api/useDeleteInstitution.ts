import type { Ref } from "vue";
import { ref } from "vue";
import { deleteInstitution } from "@/services/seb-server/institutionService.ts";
import type { InstitutionResponse } from "@/models/seb-server/institution.ts";

export const useDeleteInstitution = (
    institutions: Ref<InstitutionResponse | undefined>,
) => {
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

            if (institutions.value?.content) {
                institutions.value.content = institutions.value.content.filter(
                    (inst) => inst.id !== id,
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
