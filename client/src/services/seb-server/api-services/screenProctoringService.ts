import * as apiService from "@/services/apiService";

export async function saveScreenProctoringSettings(id: string, screenProctoringSettings: ScreenProctoringSettings): Promise<Exam | null>{
    const url: string = "/exam/" + id + "/seb-server";
    return (await apiService.api.post(url, screenProctoringSettings, {headers: apiService.getPostHeaders("accessToken")})).data;
}

export async function applyScreenProctoringGroups(id: string, spsSEBGroupsSelection: string): Promise<Exam | null>{
    const url: string =  "/exam/" + id + "/seb-server/apply-groups";
    return (await apiService.api.post(url, {}, {headers: apiService.getHeaders("accessToken"), params: {spsSEBGroupsSelection}})).data;
}

export async function activateScreenProctoring(id: string, enableScreenProctoring: boolean): Promise<Exam | null>{
    const url: string =  "/exam/" + id + "/seb-server/activation";
    return (await apiService.api.post(url, {}, {headers: apiService.getHeaders("accessToken"), params: {enableScreenProctoring}})).data;
}