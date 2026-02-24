import * as apiService from "./sp-api.service";
import * as utils from "../../utils/utils";

const searchUrl: string = "/proctoring/search";

export async function searchScreenshots(token: string, options?: {}): Promise<[object, number]>{
    const url: string = searchUrl + "/screenshots";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}

export async function searchTimeline(token: string, uuid: string, options?: {}): Promise<[object, number]>{
    const url: string =  searchUrl + "/timeline/" + uuid;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}

export async function deleteSessions(token: string, sessionUuids: [] | any): Promise<[object, number]>{
    const url: string =  "/session" + utils.createSessionDeleteUrlSuffix(sessionUuids);
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}