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

export async function getSupervisorAccountNames(token: string, options?: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.get(constants.SUPERVISOR_ACCOUNT_NAMES_ROUTE, {headers: apiService.getHeaders(token), params: options});
    return [data, status];
}

export async function editUserAccount(token: string, editedUserAccountPars: {}): Promise<[object, number]> {
    const headers = apiService.getPutHeaders(token);
    const { data, status } = await apiService.api.put(
        constants.USER_ACCOUNT_ROUTE,
        editedUserAccountPars,
        { headers }
    );
    return [data, status];
}

export async function changePassword(token: string, editPasswordParams: {}): Promise<[object, number]> {
    const headers = apiService.getPutHeaders(token);
    const { data, status } = await apiService.api.put(
        constants.USER_ACCOUNT_ROUTE + constants.CHANGE_PASSWORD_ROUTE,
        editPasswordParams,
        { headers }
    );
    return [data, status];
}

export async function deactivateAccount(token: string, id: string, body: Record<string, any> = {}): Promise<[object, number]> {
    const url: string = constants.USER_ACCOUNT_ROUTE + "/" + id + constants.DEACTIVATION_ROUTE;
    const { data, status } = await apiService.api.post(url, apiService.createUrlEncodedBody(body), {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function activateAccount(token: string, id: string, body: Record<string, any> = {}): Promise<[object, number]> {
    const url: string = constants.USER_ACCOUNT_ROUTE + "/" + id + constants.ACTIVATION_ROUTE;
    const { data, status } = await apiService.api.post(url, apiService.createUrlEncodedBody(body), {headers: apiService.getHeaders(token)});
    return [data, status];
}
