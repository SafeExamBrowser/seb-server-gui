import * as apiService from "./api.service";
import * as constants from "../utils/constants";


export async function getExamConfigurationMap(token: string, id: string, options?: {}): Promise<[object, number]>{
    const url: string =  constants.EXAM_CONFIGURATION_MAP_ROUTE + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}

export async function getExam(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function getExams(token: string, options?: {}): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
} 

export async function createExam(token: string, newExam: {}): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE;
    //todo: body should be form encoded
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody(newExam), {headers: apiService.getHeaders(token)});
    
    return [data, status];
}