import * as apiService from "./api.service";
import * as constants from "../utils/constants";

export async function applyTestRun(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.MONITORING_TEST_RUN_ROUTE + "/" + id;
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});
    
    return [data, status];
}