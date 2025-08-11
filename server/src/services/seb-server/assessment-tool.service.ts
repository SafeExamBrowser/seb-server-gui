import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function getAssessmentTools(token: string, options?: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.get(constants.LMS_SETUP_ENDPOINT, {headers: apiService.getHeaders(token), params: options});
    return [data, status];
}

export async function getAssessmentTool(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.LMS_SETUP_ENDPOINT + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}


export async function getAssessmentToolsActive(token: string, isActive: {}): Promise<[object, number]>{
    const url: string =  constants.LMS_SETUP_ENDPOINT + "/" + isActive;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}