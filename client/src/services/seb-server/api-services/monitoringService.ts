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

export async function getPendingNotifcations(examId: string, connectionToken: string): Promise<ClientNotification[] | any>{
    const url: string = monitoringUrl + "/" + examId + "/notification/" + connectionToken;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function confirmNotification(examId: string, notificationId: string, connectionToken: string): Promise<any>{
    const url: string = monitoringUrl + "/" + examId + "/notification/" + notificationId + "/" + connectionToken;
    return (await apiService.api.post(url, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).status;
}

export async function disableConnections(examId: string, connectionToken: string): Promise<any>{
    const url: string = monitoringUrl + "/" + examId + "/disable-connection";
    return (await apiService.api.post(url, {connectionToken}, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).status;
}