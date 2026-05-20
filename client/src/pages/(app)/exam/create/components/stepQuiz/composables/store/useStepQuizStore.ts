import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Quiz } from "@/models/seb-server/quiz.ts";

const getInitialState = () => ({
    selectedQuiz: undefined,
});

export const useStepQuizStore = defineStore("createExam_stepQuiz", () => {
    const selectedQuiz = ref<Quiz | undefined>(getInitialState().selectedQuiz);

    const isReady = computed<boolean>(() => selectedQuiz.value !== undefined);

    const $reset = () => {
        selectedQuiz.value = getInitialState().selectedQuiz;
    };

    return {
        isReady,
        selectedQuiz,
        $reset,
    };
});
