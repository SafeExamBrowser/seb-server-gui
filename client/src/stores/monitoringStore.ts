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

    //monitoring filters
    const clientGroupFilters = ref<number[]>([]);


    const hiddenStates = ref<number[]>([]);
    const hiddenClientGroups = ref<number[]>([]);
    const hiddenIssues = ref<number[]>([]);


    function cultivateClientGroupFilter(clientGroupId: number){
        console.log("selected client group:" + clientGroupId)


        if(clientGroupFilters.value.includes(clientGroupId)){
        
            const index: number = clientGroupFilters.value.findIndex(id => id == clientGroupId);
            if(index != -1){
                clientGroupFilters.value.splice(index, 1);
                applyClientGroupFilter();
            }

            return;
        }

        clientGroupFilters.value.push(clientGroupId);
        applyClientGroupFilter();
    }


    //par is list of the client groups that should be shown
    function applyClientGroupFilter(){
        if(clientGroups.value == null){
            return;
        }

        const allClientGroupIds: number[] = clientGroups.value.content.map(group => group.id!);
        hiddenClientGroups.value = allClientGroupIds.filter(id => !clientGroupFilters.value.includes(id));

        if(clientGroupFilters.value.length == 0){
            hiddenClientGroups.value = [];
        }

        console.log("client filter:" + clientGroupFilters.value)
        console.log("hidden client groups: " + hiddenClientGroups.value)
    }



    return {
        searchField,
        startDate,
        currentPagingOptions,
        activeTypeFilter,
        selectedExam,
        monitoringOverviewData,
        indicators,
        clientGroups,
        clientGroupFilters,
        cultivateClientGroupFilter,
        applyClientGroupFilter,
        hiddenClientGroups
    };
});