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
    const selectedExam = ref<Exam | null>(null);
    const selectedExamTemplate = ref<ExamTemplate | null>(null);
    const selectedExamSupervisors = ref<UserAccount[]>([]);
    const selectedClientGroups = ref<ClientGroup[]>([]);
    const relatedAssessmentTool = ref<AssessmentTool | null>(null);
    const applicationSettings = ref<SEBSettingsView | null>(null);
    const networkSettings = ref<SEBSettingsView | null>(null);


    function clearSelectedValues(){
        selectedExam.value = null;
        selectedExamTemplate.value = null;
        relatedAssessmentTool.value = null;
        selectedExamSupervisors.value = [];
        applicationSettings.value = null;
        networkSettings.value = null;

    }   


    return {
        searchField,
        startDate,
        currentPagingOptions,
        selectedExam,
        selectedExamTemplate,
        relatedAssessmentTool,
        selectedExamSupervisors,
        activeTypeFilter,
        activeStatusFilter,
        clearSelectedValues,
        selectedClientGroups,
        applicationSettings,
        networkSettings
    };
});