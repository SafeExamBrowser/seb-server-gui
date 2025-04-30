import * as apiService from "./sp-api.service";

const groupUrl: string = "/proctoring/group";

export async function getGroups(token: string, options?: {}): Promise<[object, number]>{
    const url: string =  groupUrl;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}

export async function getGroupByUuid(token: string, uuid: string, options?: {}): Promise<[object, number]>{
    const url: string =  groupUrl + "/" + uuid;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}