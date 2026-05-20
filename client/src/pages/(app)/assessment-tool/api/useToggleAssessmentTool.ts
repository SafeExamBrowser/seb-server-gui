import { useMutation } from "@/composables/useMutation.ts";
import {
    activateAssessmentTool,
    deactivateAssessmentTool,
} from "@/services/seb-server/assessmentToolService.ts";

export const useToggleAssessmentToolStatus = () => {
    const {
        mutateData: changeAssessmentToolStatus,
        error,
        loading,
    } = useMutation(async (id: string, active: boolean) => {
        const response = active
            ? await deactivateAssessmentTool(id)
            : await activateAssessmentTool(id);

        if (response === null) {
            throw new Error("Failed to change assessment tool status.");
        }
    });

    const changeAssessmentToolStatusFromItem = async (
        item: Record<string, unknown>,
    ) => {
        const id = item.id;
        const active = item.active;

        if (typeof id !== "number") {
            throw new Error(
                "useToggleAssessmentToolStatus: row item is missing a numeric id",
            );
        }

        if (typeof active !== "boolean") {
            throw new Error(
                "useToggleAssessmentToolStatus: row item is missing a boolean active flag",
            );
        }

        await changeAssessmentToolStatus(id.toString(), active);
    };

    return {
        changeAssessmentToolStatus,
        toggleAssessmentToolStatusFromItem: changeAssessmentToolStatusFromItem,
        error,
        loading,
    };
};
