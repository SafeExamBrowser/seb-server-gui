import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";


export async function saveScreenProctoringSettings(id: string, screenProctoringSettings: ScreenProctoringSettings): Promise<Exam | null>{
    const url: string = "/exam/" + id + "/screen-proctoring";
    return (await apiService.api.post(url, screenProctoringSettings, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function applyScreenProctoringGroups(id: string, spsSEBGroupsSelection: string): Promise<Exam | null>{
    const url: string =  "/exam/" + id + "/screen-proctoring/apply-groups";
    return (await apiService.api.post(url, {}, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: {spsSEBGroupsSelection}})).data;
}

export async function activateScreenProctoring(id: string, enableScreenProctoring: boolean): Promise<Exam | null>{
    const url: string =  "/exam/" + id + "/screen-proctoring/activation";
    return (await apiService.api.post(url, {}, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: {enableScreenProctoring}})).data;
}