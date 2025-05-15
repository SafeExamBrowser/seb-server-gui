import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const connectionConfigurationUrl = "/client_configuration";
const downloadExamConfigUrl = "/client_configuration/download";

export async function getConnectionConfigurations(isActive: string): Promise<any>{
    const url: string = connectionConfigurationUrl;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: {isActive: isActive}})).data;
}

export async function downloadExamConfig(examId: string, connectionId: string): Promise<ConnectionConfigurations | any>{
    const url: string = downloadExamConfigUrl + "/" + connectionId;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: {examId: examId}, responseType: "blob"})).data;
}