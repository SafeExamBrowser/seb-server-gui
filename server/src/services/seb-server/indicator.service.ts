import * as apiService from "./api.service";

const indicatorUrl: string = "/indicator";

export async function getIndicators(token: string, examId?: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.get(indicatorUrl, {headers: apiService.getHeaders(token), params: {examId: examId}});
    return [data, status];
}