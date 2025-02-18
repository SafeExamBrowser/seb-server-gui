import { defineStore } from "pinia";

export const useExamStore = defineStore("exam", () => {
    //exam table
    const searchField = ref<string | null>(null);
    const startDate = ref<Date | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();

    //exam detail page
    const selectedExam = ref<Exam>();
    const selectedExamTemplate = ref<ExamTemplate | null>(null);
    const selectedExamSupervisors = ref<UserAccount[]>([]);


    return {
        searchField,
        startDate,
        currentPagingOptions,
        selectedExam,
        selectedExamTemplate,
        selectedExamSupervisors
    };
});