import { defineStore } from "pinia";
import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
import {translate} from "@/utils/generalUtils";
import * as generalUtils from "@/utils/generalUtils";
import * as navigation from "@/router/navigation";


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
    // const hiddenClientGroups = ref<number[]>([]);
    const hiddenIssues = ref<number[]>([]);


    function applyClientGroupFilters(clientGroupId: number){
        if(clientGroupFilters.value.includes(clientGroupId)){
        
            const index: number = clientGroupFilters.value.findIndex(id => id == clientGroupId);
            if(index != -1){
                clientGroupFilters.value.splice(index, 1);
                activateClientGroupFilters();
            }

            return;
        }

        clientGroupFilters.value.push(clientGroupId);
        activateClientGroupFilters();
    }


    //par is list of the client groups that should be shown
    function activateClientGroupFilters(){
        if(clientGroups.value == null){
            return;
        }

        console.log("selected clientGroupFilters")
        console.log(clientGroupFilters.value)

        const allClientGroupIds: number[] = clientGroups.value.content.map(group => group.id!);
        const clientGroupsToHide: number[] = allClientGroupIds.filter(id => !clientGroupFilters.value.includes(id));

        console.log(clientGroupsToHide)

        if(clientGroupsToHide.length == 0){
            navigation.addQueryParam({});
            // hiddenClientGroups.value = [];
            return; 
        }

        navigation.addQueryParam({"hidden-client-group": generalUtils.createStringIdList(clientGroupsToHide)});
        // hiddenClientGroups.value = clientGroupsToHide;
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
        applyClientGroupFilters,
    };
});