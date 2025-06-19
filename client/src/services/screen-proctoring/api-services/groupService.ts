import { AxiosResponse } from 'axios'
import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

export async function getGroups(optionalParameters?: OptionalParGroups): Promise<GroupObject | any> {
    const url: string = "/sp/group";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN), params: {optionalParameters}})).data;
}

export async function getGroupByUuid(uuid: string, optionalParameters?: OptionalParGroupByUuid): Promise<GroupUuid | any> {
    const url: string = "/sp/group/" + uuid;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN), params: {optionalParameters}})).data;
}