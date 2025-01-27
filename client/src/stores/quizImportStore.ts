import { defineStore } from "pinia";
import {navigateTo} from "@/router/navigation";
import * as constants from "@/utils/constants";

export const useQuizImportStore = defineStore("quizImport", () => {
    const searchField = ref<string>("");

    const selectedQuiz = ref<Quiz | null>();
    const selectedExamTemplate = ref<ExamTemplate | null>(null);
    const selectedExamSupervisors = ref<UserAccountName[]>([]);
    const selectedQuitPassword = ref<string>();


    return {
        searchField,
        selectedQuiz,
        selectedExamTemplate,
        selectedExamSupervisors,
        selectedQuitPassword
    };
});