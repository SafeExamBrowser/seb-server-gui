import * as apiService from "@/services/api-services/apiService";

const monitoringUrl: string = "/monitoring"

export async function applyTestRun(id: string): Promise<Exam | any>{
    return (await apiService.api.post(monitoringUrl + "/testrun/" + id, {}, {headers: apiService.getPostHeaders()})).data;
}