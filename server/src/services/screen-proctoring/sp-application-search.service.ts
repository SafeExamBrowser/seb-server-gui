import * as apiService from "./sp-api.service";
import * as ENV from "../../config/envConfig";

const applicationSearchUrl: string = "/proctoring/search/applications";

export async function getExamsStarted(token: string, options?: {}): Promise<[object, number]>{
    const url: string = applicationSearchUrl + "/exams";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}

export async function getGroupIdsForExam(token: string, examId: string): Promise<[object, number]>{
    const url: string = applicationSearchUrl + "/groupIds/" + examId;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function getDistinctMetadataAppForExam(token: string, groupIds: {}): Promise<[object, number]>{
    const url: string = applicationSearchUrl + "/metadata/app";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: {groupIds}});

    return [data, status];
}

export async function getDistinctMetadataWindowForExam(token: string, params: {}): Promise<[object, number]>{
    const url: string = applicationSearchUrl + "/metadata/window";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: params});

    return [data, status];
}

export async function getUserListForApplicationSearch(token: string, params: {}): Promise<[object, number]>{
    const url: string = applicationSearchUrl + "/users";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: params});

    return [data, status];
}

export async function getTimestampListForApplicationSearch(token: string, params: {}): Promise<[object, number]>{
    const url: string = applicationSearchUrl + "/timestamps";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: params});

    return [data, status];
}