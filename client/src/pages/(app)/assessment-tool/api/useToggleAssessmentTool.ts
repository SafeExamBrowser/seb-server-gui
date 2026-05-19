import { notify } from "@/services/notifications/notify.ts";
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

    const changeAssessmentToolStatus = async (
        id: string,
        active: boolean,
    ): Promise<boolean> => {
        loading.value = true;

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
            notify.serverError(err, { contextLabel: "assessmenttool" });
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
            notify.serverError(
                new Error("Invalid assessment tool identifier."),
            );
            return false;
        }

        if (typeof active !== "boolean") {
            notify.serverError(new Error("Invalid assessment tool status."));
            return false;
        }

        return changeAssessmentToolStatus(id.toString(), active);
    };

    return {
        changeAssessmentToolStatus,
        toggleAssessmentToolStatusFromItem: changeAssessmentToolStatusFromItem,
        loading,
    };
};
