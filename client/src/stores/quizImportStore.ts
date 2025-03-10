import { defineStore } from "pinia";
import {navigateTo} from "@/router/navigation";
import * as constants from "@/utils/constants";

export const useQuizImportStore = defineStore("quizImport", () => {
    //exam table
    const searchField = ref<string | null>(null);
    const startTimestamp = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();
    const loadExamItemsCaller = ref<number>();

    //selected values
    const selectedAssessmentTool = ref<number | null>(null);
    const selectedQuiz = ref<Quiz | null>();
    const selectedExamTemplate = ref<ExamTemplate | null>(null);
    const selectedExamSupervisors = ref<UserAccountName[]>([]);
    const selectedQuitPassword = ref<string>();

    //other values
    const availableAssessmentTools = ref<AssessmentTools>();

    function clearValues(){
        searchField.value = null;
        startTimestamp.value = null;
        selectedQuiz.value = null;
        selectedExamTemplate.value = null;
        selectedExamSupervisors.value = [];
        selectedQuitPassword.value = "";
    }


    return {
        searchField,
        startTimestamp,
        currentPagingOptions,
        loadExamItemsCaller,
        selectedAssessmentTool,
        selectedQuiz,
        selectedExamTemplate,
        selectedExamSupervisors,
        selectedQuitPassword,
        clearValues,
        availableAssessmentTools
    };
});