import { notify } from "@/services/notifications/notify.ts";
import type { Ref } from "vue";
import { ref } from "vue";
import { AssessmentToolsResponse } from "@/models/seb-server/assessmentTool.ts";
import { deleteAssessmentTool } from "@/services/seb-server/assessmentToolService.ts";

export const useDeleteAssessmentTool = (
    assessmentTools: Ref<AssessmentToolsResponse | undefined>,
) => {
    const loading = ref(false);

    const removeAssessmentTool = async (id: string): Promise<boolean> => {
        loading.value = true;

        try {
            const response = await deleteAssessmentTool(id);

            if (response === null) {
                throw new Error("Failed to delete assessment tool");
            }

            if (assessmentTools.value?.content) {
                assessmentTools.value.content =
                    assessmentTools.value.content.filter(
                        (assessmentTool) => assessmentTool.id.toString() !== id,
                    );
            }

            return true;
        } catch (err) {
            notify.serverError(err, { contextLabel: "assessmenttool" });
            return false;
        } finally {
            loading.value = false;
        }
    };

    const removeAssessmentToolFromItem = async (
        item: Record<string, unknown>,
    ): Promise<boolean> => {
        const id = item.id;

        if (typeof id !== "number") {
            notify.serverError(
                new Error("Invalid Assessment Tool identifier."),
            );
            return false;
        }

        return removeAssessmentTool(id.toString());
    };

    return {
        removeAssessmentTool,
        removeAssessmentToolFromItem,
        loading,
    };
};
