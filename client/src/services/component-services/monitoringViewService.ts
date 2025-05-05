import * as monitoringService from "@/services/api-services/monitoringService";
import * as generalUtils from "@/utils/generalUtils";
import { useMonitoringStore } from "@/stores/monitoringStore";
import { ExamStatusEnum } from "@/models/examFiltersEnum";
import {translate} from "@/utils/generalUtils";
import * as examViewService from "@/services/component-services/examViewService";
import * as examService from "@/services/api-services/examService";
import { MonitoringHeaderEnum } from "@/models/monitoringEnums";
import {navigateTo} from "@/router/navigation";
import * as constants from "@/utils/constants";
import * as navigation from "@/router/navigation";
import { LocationQuery } from "vue-router"



//================api===============
export async function getOverview(examId: string): Promise<MonitoringOverview | null>{
    try{
        return await monitoringService.getOverview(examId);
    }catch(error){
        return null;
    }
}

export async function getConnections(examId: string, optionalHeaders: {}): Promise<MonitoringConnections | null>{
    try{
        return await monitoringService.getConnections(examId, optionalHeaders);
    }catch(error){
        return null;
    }
}

export async function getStaticClientData(examId: string, modelIds: string): Promise<MonitoringStaticClientData | null>{
    try{
        return await monitoringService.getStaticClientData(examId, modelIds);
    }catch(error){
        return null;
    }
}

export async function getExamAndStore(examId: string){
    const examResponse: Exam | null = await examViewService.getExam(examId);

    if(examResponse == null){
        return;
    }

    useMonitoringStore().selectedExam = examResponse;
}


//================url query handling===============
export function applyFilter(query: LocationQuery, filterType: MonitoringHeaderEnum, filterValue: string){
    //remove show all filter if exisits
    if(query[MonitoringHeaderEnum.SHOW_ALL]){
        delete query[MonitoringHeaderEnum.SHOW_ALL];
    }

    //if filter type & value exists in url --> remove value
    if(query[filterType]?.includes(filterValue)){
        removeQueryParam(query, filterType, filterValue);
        return;
    }

    //if filter type exists in url --> add value
    if(query[filterType]){
        filterValue = query[filterType] + "," + filterValue;
    }

    //if neither type or value exists  --> add value and type
    navigation.addQueryParam({
        ...query,
        [filterType]: filterValue
    });
}

function removeQueryParam(query: LocationQuery, filterType: MonitoringHeaderEnum, filterValue: string){
    const record: Record<string, string> = {};

    //create object
    Object.entries(query).forEach(([k, v]) => {
        if (typeof v == 'string') {
            record[k] = v;
        }
    });

    // check if key exists
    if (filterType in record) {
        const currentValue: string = record[filterType];

        //remove value
        const values: string[] = currentValue.split(',');
        const filteredValues = values.filter(value => value.trim() != filterValue);
        
        // remove key if empty
        if (filteredValues.length === 0) {
            delete record[filterType];
        } else {
            record[filterType] = filteredValues.join(',');
        }
    }

    navigation.addQueryParam({
        ...record,
    });
}

export function applyShowAllFilter(){
    navigation.addQueryParam({
       [MonitoringHeaderEnum.SHOW_ALL]: true
    });
}




//================display / text logic===============
export function isMonitoringDisabled(): boolean{    
    return useMonitoringStore().selectedExam == null || 
    generalUtils.findEnumValue(ExamStatusEnum, useMonitoringStore().selectedExam?.status) != ExamStatusEnum.RUNNING;
}

export function getMonitoringDisabledWarningText(): string{
    if(useMonitoringStore().selectedExam == null){
        return translate("monitoringOverview.warning.notExist");
    } 

    if(generalUtils.findEnumValue(ExamStatusEnum, useMonitoringStore().selectedExam?.status) != ExamStatusEnum.RUNNING){
        return translate("monitoringOverview.warning.notRunning");
    }

    return "";
}

//================navigation===============
export function goToMonitoring(header: MonitoringHeaderEnum, value: string | boolean, examId: string){
    navigateTo(
        constants.MONITORING_CLIENTS_ROUTE + '/' + examId,
        {[header]: value}
    );
}