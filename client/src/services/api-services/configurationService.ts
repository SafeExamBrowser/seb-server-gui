import * as apiService from "@/services/api-services/apiService";

const connectionConfigurationUrl = "/client_configuration";
const downloadExamConfigUrl = "/client_configuration/download";

export async function getConnectionConfigurations(isActive: string): Promise<any>{
    const url: string = connectionConfigurationUrl;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {isActive: isActive}})).data;
}

export async function downloadExamConfig(examId: string, connectionId: string): Promise<ConnectionConfigurations | any>{
    const url: string = downloadExamConfigUrl + "/" + connectionId;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {examId: examId}, responseType: "blob"})).data;
}