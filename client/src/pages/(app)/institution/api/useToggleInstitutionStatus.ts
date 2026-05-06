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
        modelId: string,
        active: boolean,
    ): Promise<boolean> => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = active
                ? await deactivateInstitution(modelId)
                : await activateInstitution(modelId);

            if (response === null) {
                throw new Error("Failed to change institution status.");
            }

            if (institutions.value?.content) {
                institutions.value.content = institutions.value.content.map(
                    (inst) =>
                        inst.modelId === modelId
                            ? { ...inst, active: !active }
                            : inst,
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
        const modelId = item.modelId;
        const active = item.active;

        if (typeof modelId !== "string") {
            error.value = "Invalid institution identifier.";
            return false;
        }

        if (typeof active !== "boolean") {
            error.value = "Invalid institution status.";
            return false;
        }

        return changeInstitutionStatus(modelId, active);
    };

    return {
        changeInstitutionStatus,
        toggleInstitutionStatusFromItem: changeInstitutionStatusFromItem,
        loading,
        error,
    };
};
