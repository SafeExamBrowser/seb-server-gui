import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function registerUserAccount(body: Record<string, any>): Promise<[object, number]> {
    const { data, status } = await apiService.api.post(
        constants.USER_ACCOUNT_REGISTRATION_SERVER_ROUTE, apiService.createUrlEncodedBody(body), {headers: apiService.getHeadersWithoutAuth()});
    return [data, status];
}

export async function getUserAccountFeatures(token: string): Promise<[object, number]>{
    const url: string =  constants.FEATURE_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function getUserAccountNames(token: string, options?: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.get(constants.USER_ACCOUNT_NAMES_ROUTE, {headers: apiService.getHeaders(token), params: options});
    return [data, status];
}
