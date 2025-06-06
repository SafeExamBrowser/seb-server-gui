import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const monitoringUrl: string = "/monitoring"

export async function applyTestRun(id: string): Promise<Exam | any>{
    return (await apiService.api.post(monitoringUrl + "/testrun/" + id, {}, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function getOverview(examId: string): Promise<MonitoringOverview | any>{
    return (await apiService.api.get(monitoringUrl + "/get-overview/" + examId, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function getConnections(examId: string, optionalHeaders: {}): Promise<MonitoringConnections | any>{
    const url: string = monitoringUrl + "/connections/" + examId;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: {optionalHeaders}})).data;
}

export async function getSingleConnection(examId: string, connectionToken: string): Promise<SingleConnection | any>{
    const url: string = "/get-monitoring/" + examId + "/" + connectionToken;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function getStaticClientData(examId: string, modelIds: string): Promise<MonitoringStaticClientData | any>{
    const url: string = monitoringUrl + "/" + examId + "/static-client-data";
    return (await apiService.api.post(url, {modelIds}, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function registerInstruction(examId: string, clientInstruction: ClientInstruction): Promise<any>{
    const url: string = monitoringUrl + "/" + examId + "/instruction";
    return (await apiService.api.post(url, clientInstruction, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).status;
}