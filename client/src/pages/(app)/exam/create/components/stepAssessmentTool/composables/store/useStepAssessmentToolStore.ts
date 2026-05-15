import { defineStore } from "pinia";
import { computed, ref } from "vue";

const getInitialState = () => ({
    selectedAssessmentToolId: undefined,
});

export const useStepAssessmentToolStore = defineStore(
    "createExam_stepAssessmentTool",
    () => {
        const selectedAssessmentToolId = ref<number | undefined>(
            getInitialState().selectedAssessmentToolId,
        );

        const isReady = computed<boolean>(
            () => selectedAssessmentToolId.value !== undefined,
        );

        const $reset = () => {
            selectedAssessmentToolId.value =
                getInitialState().selectedAssessmentToolId;
        };

        return {
            isReady,
            selectedAssessmentToolId,
            $reset,
        };
    },
);
