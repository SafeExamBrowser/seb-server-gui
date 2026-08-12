import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { ExamTemplateSelection } from "@/models/examTemplate.ts";

const getInitialState = () => ({
    selectedExamTemplate: undefined,
});

export const useStepExamTemplateStore = defineStore(
    "createExam_stepExamTemplate",
    () => {
        const selectedExamTemplate = ref<ExamTemplateSelection | undefined>(
            getInitialState().selectedExamTemplate,
        );

        const isReady = computed<boolean>(
            () =>
                selectedExamTemplate.value !== undefined &&
                selectedExamTemplate.value.id !== undefined,
        );

        const $reset = () => {
            selectedExamTemplate.value = getInitialState().selectedExamTemplate;
        };

        return {
            isReady,
            selectedExamTemplate,
            $reset,
        };
    },
);
