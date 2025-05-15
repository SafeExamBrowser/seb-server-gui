import { AxiosResponse } from 'axios'
import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

export async function searchSessionsDay(optionalParamters?: OptionalParSearchSessions): Promise<string[] | any> {
    const url: string = "/sp/search/sessions/day";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN), params: {optionalParamters}})).data;
}

export async function searchSessions(optionalParamters?: OptionalParSearchSessions): Promise<SearchSessions | any> {
    const url: string = "/sp/search/sessions";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN), params: {optionalParamters}})).data;
}

export async function searchScreenshots(optionalParamters?: OptionalParSearchScreenshots): Promise<SearchScreenshots | any> {
    const url: string = "/sp/search/screenshots"
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN), params: {optionalParamters}})).data;
}

export async function searchTimeline(sessionId: string, optionalParamters?: OptionalParSearchTimeline): Promise<SearchTimeline | any> {
    const url: string = "/sp/search/timeline/" + sessionId;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN), params: {optionalParamters}})).data;
}

export async function deleteSessions(sessionUuids: string[]): Promise<object | any> {
    const url: string = "/sp/search/sessions/delete" + apiService.createSessionDeleteUrlSuffix(sessionUuids);
    return await apiService.api.delete(url, {headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN)});
}