import * as apiService from "./api.service";
import * as constants from "../utils/constants";

export async function getAssessmentTools(token: string, isActive: {}): Promise<[object, number]>{
    const url: string =  "/lms-setup/" + isActive;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}