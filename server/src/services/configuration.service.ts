import * as apiService from "./api.service";
import * as constants from "../utils/constants";


export async function downloadExamConfig(token: string, connectionId: string, examId: {}): Promise<[object, number]>{
    const url: string =  constants.DOWNLOAD_EXAM_CONFIG_ROUTE + "/" + connectionId;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getOctetStreamHeaders(token), params: {id: examId}, responseType: "arraybuffer"});

    return [data, status];
}

export async function getConnectionConfigurations(token: string, isActive: {}){
    const url: string =  constants.CONNECTION_CONFIG_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: {active: isActive}});

    return [data, status];
}