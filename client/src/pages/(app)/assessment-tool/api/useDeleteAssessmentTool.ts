import { useMutation } from "@/composables/useMutation.ts";
import { deleteAssessmentTool } from "@/services/seb-server/assessmentToolService.ts";

export const useDeleteAssessmentTool = () => {
    const {
        mutateData: removeAssessmentTool,
        error,
        loading,
    } = useMutation(async (id: string) => {
        const response = await deleteAssessmentTool(id);

        if (response === null) {
            throw new Error("Failed to delete assessment tool.");
        }
    });

    const removeAssessmentToolFromItem = async (
        item: Record<string, unknown>,
    ) => {
        const id = item.id;

        if (typeof id !== "number") {
            throw new Error(
                "useDeleteAssessmentTool: row item is missing a numeric id",
            );
        }

        await removeAssessmentTool(id.toString());
    };

    return {
        removeAssessmentTool,
        removeAssessmentToolFromItem,
        error,
        loading,
    };
};
