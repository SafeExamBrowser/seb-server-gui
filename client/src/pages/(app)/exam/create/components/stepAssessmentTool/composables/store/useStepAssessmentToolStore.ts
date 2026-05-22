import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { useAssessmentTools } from "@/pages/(app)/exam/create/components/stepAssessmentTool/composables/api/useAssessmentTools.ts";

const getInitialState = () => ({
    selectedAssessmentToolId: undefined,
});

export const useStepAssessmentToolStore = defineStore(
    "createExam_stepAssessmentTool",
    () => {
        const { data: assessmentTools, loading, error } = useAssessmentTools();

        const selectedAssessmentToolId = ref<number | undefined>(
            getInitialState().selectedAssessmentToolId,
        );

        watchEffect(() => {
            if (
                selectedAssessmentToolId.value === undefined &&
                assessmentTools.value?.content.length === 1
            ) {
                selectedAssessmentToolId.value =
                    assessmentTools.value.content[0].id;
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
            $reset,
        };
    },
);
