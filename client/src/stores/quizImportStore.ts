import { defineStore } from "pinia";
import {navigateTo} from "@/router/navigation";
import * as constants from "@/utils/constants";

export const useQuizImportStore = defineStore("quizImport", () => {
    //exam table
    const searchField = ref<string | null>(null);
    const startDate = ref<Date | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();
    const loadExamItemsCaller = ref<number>();

    const selectedQuiz = ref<Quiz | null>();
    const selectedExamTemplate = ref<ExamTemplate | null>(null);
    const selectedExamSupervisors = ref<UserAccountName[]>([]);
    const selectedQuitPassword = ref<string>();


    return {
        searchField,
        startDate,
        currentPagingOptions,
        loadExamItemsCaller,
        selectedQuiz,
        selectedExamTemplate,
        selectedExamSupervisors,
        selectedQuitPassword
    };
});