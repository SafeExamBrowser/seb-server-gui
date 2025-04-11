import { defineStore } from "pinia";
import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
import {translate} from "@/utils/generalUtils";
import * as generalUtils from "@/utils/generalUtils";


export const useMonitoringStore = defineStore("monitoring", () => {


    //exam table
    const searchField = ref<string | null>(null);
    const startDate = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();
    const activeTypeFilter = ref<ExamTypeEnum | null>(null);

    //monitoring overview
    const selectedExam = ref<Exam | null>(null);
    const monitoringOverviewData = ref<MonitoringOverview | null>(null); 

    //monitoring clients
    const indicators = ref<Indicators | null>(null);
    const clientGroups = ref<ClientGroups | null>(null);



    return {
        searchField,
        startDate,
        currentPagingOptions,
        activeTypeFilter,
        selectedExam,
        monitoringOverviewData,
        indicators,
        clientGroups
    };
});