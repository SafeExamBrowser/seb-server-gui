import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { Quiz } from "@/models/seb-server/quiz.ts";

const getInitialState = () => ({
    selectedQuiz: undefined,
    searchInitialized: false,
});

export const useStepQuizStore = defineStore("createExam_stepQuiz", () => {
    const selectedQuiz = ref<Quiz | undefined>(getInitialState().selectedQuiz);

    const searchInitialized = ref<boolean>(getInitialState().searchInitialized);

    const isReady = computed<boolean>(() => selectedQuiz.value !== undefined);

    const $reset = () => {
        selectedQuiz.value = getInitialState().selectedQuiz;
        searchInitialized.value = getInitialState().searchInitialized;
    };

    return {
        isReady,
        selectedQuiz,
        searchInitialized,
        $reset,
    };
});
