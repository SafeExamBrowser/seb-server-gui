import * as apiService from "./sp-api.service";
import * as ENV from "../../config/envConfig";

const applicationSearchUrl: string = "/proctoring/search/applications";

export async function getTimestampListForApplicationSearch(token: string, params: {}): Promise<[object, number]>{
    const url: string = applicationSearchUrl + "/timestamps";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: params});

    return [data, status];
}