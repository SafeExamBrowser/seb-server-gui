import * as apiService from "@/services/api-services/apiService";

const url: string = "/client-group"

export async function createClientGroup(clientGroup: ClientGroup): Promise<ClientGroup | any>{

    console.log("it got here")

    return (await apiService.api.post(url, clientGroup, {headers: apiService.getPostHeaders()})).data;
}

export async function getClientGroups(examId?: string): Promise<ClientGroups | any>{
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {examId}})).data;
}