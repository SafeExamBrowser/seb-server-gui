import { ExamStatusEnum, ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
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
    const templateGroupsWithSp = ref<number[]>([]);
    const selectedExamSupervisors = ref<UserAccount[]>([]);
    const selectedClientGroups = ref<ClientGroup[]>([]);
    const relatedAssessmentTool = ref<AssessmentTool | null>(null);

    const importMessages = ref<APIMessage[]>([]);

    function clearSelectedValues(){
        selectedExam.value = null;
        selectedExamTemplate.value = null;
        relatedAssessmentTool.value = null;
        selectedExamSupervisors.value = [];
    }   


    return {
        searchField,
        startDate,
        currentPagingOptions,
        selectedExam,
        selectedExamTemplate,
        templateGroupsWithSp,
        relatedAssessmentTool,
        selectedExamSupervisors,
        activeTypeFilter,
        activeStatusFilter,
        clearSelectedValues,
        selectedClientGroups,
        importMessages
    };
});