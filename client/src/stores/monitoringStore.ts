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



    function isMonitoringDisabled(): boolean{
        return selectedExam.value == null || 
        generalUtils.findEnumValue(ExamStatusEnum, selectedExam.value.status) != ExamStatusEnum.RUNNING;
    }

    function getMonitoringDisabledWarningText(): string{
        if(selectedExam.value == null){
            return translate("monitoringOverview.warning.notExist");
        } 

        if(generalUtils.findEnumValue(ExamStatusEnum, selectedExam.value.status) != ExamStatusEnum.RUNNING){
            return translate("monitoringOverview.warning.notRunning");
        }

        return "";
    }
    

    return {
        searchField,
        startDate,
        currentPagingOptions,
        activeTypeFilter,
        selectedExam,
        monitoringOverviewData,
        isMonitoringDisabled,
        getMonitoringDisabledWarningText
    };
});