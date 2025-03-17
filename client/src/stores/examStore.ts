import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
import { defineStore } from "pinia";

export const useExamStore = defineStore("exam", () => {
    //exam table
    const searchField = ref<string | null>(null);
    const startDate = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();
    const activeTypeFilter = ref<ExamTypeEnum | null>(null);
    const activeStatusFilter = ref<ExamStatusEnum | null>(null);


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
        selectedExamSupervisors,
        activeTypeFilter,
        activeStatusFilter
    };
});