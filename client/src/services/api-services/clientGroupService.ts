import * as apiService from "@/services/api-services/apiService";

const url: string = "/client-group";

export async function createClientGroup(clientGroup: ClientGroup): Promise<ClientGroup | any>{
    return (await apiService.api.post(url, clientGroup, {headers: apiService.getPostHeaders()})).data;
}

export async function updateClientGroup(clientGroup: ClientGroup): Promise<ClientGroup | any>{
    return (await apiService.api.put(url, clientGroup, {headers: apiService.getPostHeaders()})).data;
}

export async function deleteClientGroup(id: string): Promise<any | null>{
    return (await apiService.api.delete(url + "/" + id, {headers: apiService.getHeaders()})).data;
}

export async function getClientGroup(id: string): Promise<ClientGroup | any>{
    return (await apiService.api.get(url + "/" + id, {headers: apiService.getHeaders()})).data;
}

export async function getClientGroups(id?: string): Promise<ClientGroups | any>{
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {id}})).data;
}