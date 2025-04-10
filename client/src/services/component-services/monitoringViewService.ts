import * as monitoringService from "@/services/api-services/monitoringService";

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