import { defineStore } from "pinia";
import { ref } from "vue";

import { AssessmentTool } from "@/models/seb-server/assessmentTool";
import { ClientGroup } from "@/models/seb-server/clientGroup";
import { ConfigurationExamMapping } from "@/models/seb-server/configurationNode";
import { Exam } from "@/models/seb-server/exam";
import {
    ExamStatusEnum,
    ExamTypeEnum,
} from "@/models/seb-server/examFiltersEnum";
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { ServerTablePaging } from "@/models/types";
import { UserAccount } from "@/models/userAccount";

export const useExamStore = defineStore("exam", () => {
    // exam table
    const searchField = ref<string | null>(null);
    const startDate = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();
    const activeTypeFilter = ref<ExamTypeEnum | null>(null);
    const activeStatusFilter = ref<ExamStatusEnum | null>(null);

    // exam detail page
    const selectedExam = ref<Exam | null>(null);
    const selectedConfigMapping = ref<ConfigurationExamMapping | null>(null);
    const selectedExamTemplate = ref<ExamTemplate | null>(null);
    const templateGroupsWithSp = ref<number[]>([]);
    const selectedExamSupervisors = ref<UserAccount[]>([]);
    const selectedClientGroups = ref<ClientGroup[]>([]);
    const relatedAssessmentTool = ref<AssessmentTool | null>(null);

    function clearSelectedValues() {
        selectedExam.value = null;
        selectedExamTemplate.value = null;
        relatedAssessmentTool.value = null;
        selectedExamSupervisors.value = [];
    }

    function clearSelectedSupervisors() {
        selectedExamSupervisors.value = [];
    }

    return {
        searchField,
        startDate,
        currentPagingOptions,
        selectedExam,
        selectedConfigMapping,
        selectedExamTemplate,
        templateGroupsWithSp,
        relatedAssessmentTool,
        selectedExamSupervisors,
        activeTypeFilter,
        activeStatusFilter,
        clearSelectedValues,
        clearSelectedSupervisors,
        selectedClientGroups,
    };
});
