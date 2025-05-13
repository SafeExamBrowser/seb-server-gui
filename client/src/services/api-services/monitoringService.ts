import * as apiService from "@/services/api-services/apiService";

const monitoringUrl: string = "/monitoring"

export async function applyTestRun(id: string): Promise<Exam | any>{
    return (await apiService.api.post(monitoringUrl + "/testrun/" + id, {}, {headers: apiService.getPostHeaders()})).data;
}

export async function getOverview(examId: string): Promise<MonitoringOverview | any>{
    return (await apiService.api.get(monitoringUrl + "/get-overview/" + examId, {headers: apiService.getHeaders()})).data;
}

export async function getConnections(examId: string, optionalHeaders: {}): Promise<MonitoringConnections | any>{
    const url: string = monitoringUrl + "/connections/" + examId;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalHeaders}})).data;
}

export async function getStaticClientData(examId: string, modelIds: string): Promise<MonitoringStaticClientData | any>{
    const url: string = monitoringUrl + "/" + examId + "/static-client-data";
    return (await apiService.api.post(url, {modelIds}, {headers: apiService.getPostHeaders()})).data;
}

export async function registerInstruction(examId: string, clientInstruction: ClientInstruction): Promise<any>{
    const url: string = monitoringUrl + "/" + examId + "/instruction";
    return (await apiService.api.post(url, clientInstruction, {headers: apiService.getPostHeaders()})).status;
}