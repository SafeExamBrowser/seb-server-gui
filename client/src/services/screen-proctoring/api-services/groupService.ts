import { AxiosResponse } from 'axios'
import * as apiService from "@/services/apiService";

export async function getGroups(optionalParamters?: OptionalParGroups): Promise<GroupObject | any> {
    const url: string = "/sp/group";
    return (await apiService.api.get(url, {headers: apiService.getHeaders("spAccessToken"), params: {optionalParamters}})).data;
}

export async function getGroupByUuid(uuid: string, optionalParamters?: OptionalParGroupByUuid): Promise<GroupUuid | any> {
    const url: string = "/sp/group/" + uuid;
    return (await apiService.api.get(url, {headers: apiService.getHeaders("spAccessToken"), params: {optionalParamters}})).data;
}