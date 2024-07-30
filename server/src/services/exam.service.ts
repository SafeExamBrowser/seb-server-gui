import * as apiService from "./api.service";
import * as constants from "../utils/constants";


export async function getExams(token: string, options?: {}): Promise<object>{
    const url: string =  constants.EXAM_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return data;
}

export async function getExamConfigurationMap(token: string, id: string, options?: {}): Promise<object>{
    const url: string =  constants.EXAM_CONFIGURATION_MAP_ROUTE + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return data;
}
