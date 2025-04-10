import * as apiService from "@/services/api-services/apiService";

const monitoringUrl: string = "/monitoring"

export async function applyTestRun(id: string): Promise<Exam | any>{
    return (await apiService.api.post(monitoringUrl + "/testrun/" + id, {}, {headers: apiService.getPostHeaders()})).data;
}

export async function getOverview(examId: string): Promise<MonitoringOverview | any>{
    return (await apiService.api.get(monitoringUrl + "/get-overview/" + examId, {headers: apiService.getHeaders()})).data;
}