import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function saveScreenProctoringSettings(token: string, id: string, screenProctoringSettings: {}): Promise<[object, number]>{
    const url: string =  "/exam/" + id + "/screen-proctoring";
    const {data, status} = await apiService.api.post(
        url, 
        screenProctoringSettings, 
        {headers: apiService.getApplicationJsonHeaders(token)}
    );
    
    return [data, status];
}

export async function applyScreenProctoringGroups(token: string, id: string, spsSEBGroupsSelection: {}){
    const url: string =  "/exam/" + id + "/screen-proctoring/apply-groups";
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token), params: {spsSEBGroupsSelection: spsSEBGroupsSelection}});
    return [data, status];
}

export async function activateScreenProctoring(token: string, id: string, enableScreenProctoring: {}){
    const url: string =  "/exam/" + id + "/screen-proctoring/activation";

    console.log(url)
    console.log(enableScreenProctoring)

    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token), params: {enableScreenProctoring: enableScreenProctoring}});
    return [data, status];
}