import * as apiService from "./api.service";
import * as constants from "../utils/constants";

const clientGroupUrl: string =  constants.CLIENT_GROUP_ROUTE;

export async function createClientGroup(token: string, clientGroup: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.post(clientGroupUrl, apiService.createUrlEncodedBody(clientGroup), {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function updateClientGroup(token: string, clientGroup: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.put(clientGroupUrl, clientGroup, {headers: apiService.getApplicationJsonHeaders(token)});
    return [data, status];
}

export async function deleteClientGroup(token: string, id: string): Promise<[object, number]>{
    const {data, status} = await apiService.api.delete(clientGroupUrl + "/" + id, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function getClientGroup(token: string, id: string): Promise<[object, number]>{
    const {data, status} = await apiService.api.get(clientGroupUrl + "/" + id, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function getClientGroups(token: string, examId?: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.get(clientGroupUrl, {headers: apiService.getHeaders(token), params: {examId: examId}});
    return [data, status];
}