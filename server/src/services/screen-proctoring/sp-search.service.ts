import * as apiService from "./sp-api.service";
import * as utils from "../../utils/utils";

const searchUrl: string = "/proctoring/search";

export async function deleteSessions(token: string, sessionUuids: [] | any): Promise<[object, number]>{
    const url: string =  "/session" + utils.createSessionDeleteUrlSuffix(sessionUuids);
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}