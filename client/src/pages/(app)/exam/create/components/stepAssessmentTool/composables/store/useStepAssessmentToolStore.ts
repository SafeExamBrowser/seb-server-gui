import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { useAssessmentTools } from "@/pages/(app)/exam/create/components/stepAssessmentTool/composables/api/useAssessmentTools.ts";

const getInitialState = () => ({
    selectedAssessmentToolId: undefined,
});

export const useStepAssessmentToolStore = defineStore(
    "createExam_stepAssessmentTool",
    () => {
        // the fetch is triggered by the create exam page on every navigation,
        // so the list stays fresh across visits, consider invalidating once migration to openapi/tanstack is done
        const {
            data: assessmentTools,
            loading,
            error,
            fetchData: fetchAssessmentTools,
        } = useAssessmentTools({ immediate: false });

        const selectedAssessmentToolId = ref<number | undefined>(
            getInitialState().selectedAssessmentToolId,
        );

        watchEffect(() => {
            const tools = assessmentTools.value?.content;
            if (!tools) {
                return;
            }

            // a refetch can drop the selected tool from the list (e.g. it was
            // deactivated in the meantime) - clear the selection in that case
            if (
                selectedAssessmentToolId.value !== undefined &&
                !tools.some(
                    (tool) => tool.id === selectedAssessmentToolId.value,
                )
            ) {
                selectedAssessmentToolId.value = undefined;
            }

            if (
                selectedAssessmentToolId.value === undefined &&
                tools.length === 1
            ) {
                selectedAssessmentToolId.value = tools[0].id;
            }
        });

        const isReady = computed<boolean>(
            () => selectedAssessmentToolId.value !== undefined,
        );

        const $reset = () => {
            selectedAssessmentToolId.value =
                getInitialState().selectedAssessmentToolId;
        };

        return {
            assessmentTools,
            loading,
            error,
            isReady,
            selectedAssessmentToolId,
            fetchAssessmentTools,
            $reset,
        };
    },
);
