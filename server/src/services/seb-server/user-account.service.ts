import * as apiService from "./api.service";
import * as constants from "../../utils/constants";
import qs from "qs";
import {USER_ACCOUNT_ROUTE} from "../../utils/constants";


export async function getUserAccount(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.USER_ACCOUNT_ROUTE + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function getUserAccounts(token: string, options?: {}): Promise<[object, number]>{
    const url: string =  constants.USER_ACCOUNT_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});
    return [data, status];
}

export async function getUserAccountNames(token: string, options?: {}): Promise<[object, number]>{
    const url: string =  constants.USER_ACCOUNT_NAMES_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}


export async function registerUserAccount(options: Record<string, any>): Promise<[object, number]> {
    const { data, status } = await apiService.api.post(
        constants.USER_ACCOUNT_REGISTRATION_SERVER_ROUTE,
        qs.stringify(options),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return [data, status];
}


export async function deleteUserAccount(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.USER_ACCOUNT_ROUTE + "/" + id;
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function createUserAccount(token: string, newUserAccount: {}): Promise<[object, number]>{
    const url: string =  constants.USER_ACCOUNT_ROUTE;
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody(newUserAccount), {headers: apiService.getHeaders(token)});
    return [data, status];
}
export async function getSupervisorAccountNames(token: string, options?: {}): Promise<[object, number]>{
    const url: string =  constants.SUPERVISOR_ACCOUNT_NAMES_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}

