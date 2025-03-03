import * as apiService from "./api.service";
import * as constants from "../utils/constants";

export async function saveScreenProctoringSettings(token: string, id: string, screenProctoringSettings: {}): Promise<[object, number]>{
    const url: string =  constants.EXAM_SCREEN_PROCTORING_ROUTE;
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody(screenProctoringSettings), {headers: apiService.getHeaders(token)});
    
    return [data, status];
}