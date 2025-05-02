import * as apiService from "@/services/apiService";

const connectionConfigurationUrl = "/client_configuration";
const downloadExamConfigUrl = "/client_configuration/download";

export async function getConnectionConfigurations(isActive: string): Promise<any>{
    const url: string = connectionConfigurationUrl;
    return (await apiService.api.get(url, {headers: apiService.getHeaders("accessToken"), params: {isActive: isActive}})).data;
}

export async function downloadExamConfig(examId: string, connectionId: string): Promise<ConnectionConfigurations | any>{
    const url: string = downloadExamConfigUrl + "/" + connectionId;
    return (await apiService.api.get(url, {headers: apiService.getHeaders("accessToken"), params: {examId: examId}, responseType: "blob"})).data;
}