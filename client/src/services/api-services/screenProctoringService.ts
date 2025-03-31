import * as apiService from "@/services/api-services/apiService";

export async function saveScreenProctoringSettings(id: string, screenProctoringSettings: ScreenProctoringSettings): Promise<Exam | null>{
    const url: string = "/exam/" + id + "/screen-proctoring";
    return (await apiService.api.post(url, screenProctoringSettings, {headers: apiService.getPostHeaders()})).data;
}

export async function applyScreenProctoringGroups(id: string, spsSEBGroupsSelection: string): Promise<Exam | null>{
    const url: string =  "/exam/" + id + "/screen-proctoring/apply-groups";
    return (await apiService.api.post(url, {}, {headers: apiService.getHeaders(), params: {spsSEBGroupsSelection}})).data;
}

export async function activateScreenProctoring(id: string, enableScreenProctoring: boolean): Promise<Exam | null>{
    const url: string =  "/exam/" + id + "/screen-proctoring/activation";
    return (await apiService.api.post(url, {}, {headers: apiService.getHeaders(), params: {enableScreenProctoring}})).data;
}