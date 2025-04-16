import * as monitoringService from "@/services/api-services/monitoringService";
import * as generalUtils from "@/utils/generalUtils";
import { useMonitoringStore } from "@/stores/monitoringStore";
import { ExamStatusEnum } from "@/models/examFiltersEnum";
import {translate} from "@/utils/generalUtils";
import * as examViewService from "@/services/component-services/examViewService";
import * as examService from "@/services/api-services/examService";


//================api===============
export async function getOverview(examId: string): Promise<MonitoringOverview | null>{
    try{
        return await monitoringService.getOverview(examId);
    }catch(error){
        return null;
    }
}

export async function getFullPage(examId: string): Promise<MonitoringFullPageData | null>{
    try{
        return await monitoringService.getFullPage(examId);
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