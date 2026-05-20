import { useMutation } from "@/composables/useMutation.ts";
import {
    activateInstitution,
    deactivateInstitution,
} from "@/services/seb-server/institutionService.ts";

export const useToggleInstitutionStatus = () => {
    const {
        mutateData: changeInstitutionStatus,
        error,
        loading,
    } = useMutation(async (id: number, active: boolean) => {
        const response = active
            ? await deactivateInstitution(id)
            : await activateInstitution(id);

        if (response === null) {
            throw new Error("Failed to change institution status.");
        }
    });

    const changeInstitutionStatusFromItem = async (
        item: Record<string, unknown>,
    ) => {
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

        await changeInstitutionStatus(id, active);
    };

    return {
        changeInstitutionStatus,
        toggleInstitutionStatusFromItem: changeInstitutionStatusFromItem,
        error,
        loading,
    };
};
