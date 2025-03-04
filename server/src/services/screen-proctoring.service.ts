import * as apiService from "./api.service";
import * as constants from "../utils/constants";

export async function saveScreenProctoringSettings(token: string, id: string, screenProctoringSettings: {}): Promise<[object, number]>{
    const url: string =  "/exam/" + id + "/screen-proctoring";
    const {data, status} = await apiService.api.post(
        url, 
        screenProctoringSettings, 
        {headers: apiService.getApplicationJsonHeaders(token)}
    );
    
    return [data, status];
}