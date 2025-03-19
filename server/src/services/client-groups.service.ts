import * as apiService from "./api.service";
import * as constants from "../utils/constants";

export async function getClientGroups(token: string, examId?: {}): Promise<[object, number]>{
    const url: string =  constants.CLIENT_GROUP_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: {examId: examId}});

    return [data, status];
}