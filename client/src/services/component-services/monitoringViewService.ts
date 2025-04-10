import * as monitoringService from "@/services/api-services/monitoringService";

export async function getOverview(examId: string): Promise<MonitoringOverview | null>{
    try{
        return await monitoringService.getOverview(examId);
    }catch(error){
        return null;
    }
}
