import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function getAssessmentTools(token: string, isActive: {}): Promise<[object, number]>{
    const url: string =  constants.LMS_SETUP_ENDPOINT + "/" + isActive;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function getAssessmentTool(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.LMS_SETUP_ENDPOINT + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}