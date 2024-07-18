import * as apiService from "./api.service";

const groupUrl: string = "/proctoring/group";

export async function getGroups(token: string, options?: {}): Promise<object>{
    const url: string =  groupUrl;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return data;
}

export async function getGroupByUuid(token: string, uuid: string, options?: {}): Promise<object>{
    const url: string =  groupUrl + "/" + uuid;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return data;
}