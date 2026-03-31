import type { Ref } from "vue";
import { ref } from "vue";
import { AssessmentToolsResponse } from "@/models/seb-server/assessmentTool.ts";
import {
    activateAssessmentTool,
    deactivateAssessmentTool,
} from "@/services/seb-server/assessmentToolService.ts";

export const useToggleAssessmentToolStatus = (
    assessmentTools: Ref<AssessmentToolsResponse | undefined>,
) => {
    const loading = ref(false);
    const error = ref<string>();

    const changeAssessmentToolStatus = async (
        id: string,
        active: boolean,
    ): Promise<boolean> => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = active
                ? await deactivateAssessmentTool(id)
                : await activateAssessmentTool(id);

            if (response === null) {
                throw new Error("Failed to change assessment tool status.");
            }

            if (assessmentTools.value?.content) {
                assessmentTools.value.content =
                    assessmentTools.value.content.map((assessmentTool) =>
                        assessmentTool.id.toString() === id
                            ? {
                                  ...assessmentTool,
                                  active: !active,
                              }
                            : assessmentTool,
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

    const changeAssessmentToolStatusFromItem = async (
        item: Record<string, unknown>,
    ): Promise<boolean> => {
        const id = item.id;
        const active = item.active;

        if (typeof id !== "number") {
            error.value = "Invalid assessment tool identifier.";
            return false;
        }

        if (typeof active !== "boolean") {
            error.value = "Invalid assessment tool status.";
            return false;
        }

        return changeAssessmentToolStatus(id.toString(), active);
    };

    return {
        changeAssessmentToolStatus,
        toggleAssessmentToolStatusFromItem: changeAssessmentToolStatusFromItem,
        loading,
        error,
    };
};
