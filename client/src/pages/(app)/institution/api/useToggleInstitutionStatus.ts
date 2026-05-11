import type { Ref } from "vue";
import { ref } from "vue";
import type { InstitutionResponse } from "@/models/seb-server/institution.ts";
import {
    activateInstitution,
    deactivateInstitution,
} from "@/services/seb-server/institutionService.ts";

export const useToggleInstitutionStatus = (
    institutions: Ref<InstitutionResponse | undefined>,
) => {
    const loading = ref(false);
    const error = ref<string>();

    const changeInstitutionStatus = async (
        id: number,
        active: boolean,
    ): Promise<boolean> => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = active
                ? await deactivateInstitution(id)
                : await activateInstitution(id);

            if (response === null) {
                throw new Error("Failed to change institution status.");
            }

            if (institutions.value?.content) {
                institutions.value.content = institutions.value.content.map(
                    (inst) =>
                        inst.id === id ? { ...inst, active: !active } : inst,
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

    const changeInstitutionStatusFromItem = async (
        item: Record<string, unknown>,
    ): Promise<boolean> => {
        const id = item.id;
        const active = item.active;

        if (typeof id !== "number") {
            throw new Error(
                "useToggleInstitutionStatus: row item is missing a numeric id",
            );
        }

        if (typeof active !== "boolean") {
            throw new Error(
                "useToggleInstitutionStatus: row item is missing a boolean active flag",
            );
        }

        return changeInstitutionStatus(id, active);
    };

    return {
        changeInstitutionStatus,
        toggleInstitutionStatusFromItem: changeInstitutionStatusFromItem,
        loading,
        error,
    };
};
