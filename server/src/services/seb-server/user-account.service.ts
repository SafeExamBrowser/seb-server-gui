import * as apiService from "./api.service";
import * as constants from "../../utils/constants";
import qs from "qs";

export async function createUserAccount(token: string, newUserAccount: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.post(constants.USER_ACCOUNT_ROUTE, apiService.createUrlEncodedBody(newUserAccount), {headers: apiService.getHeaders(token)});
    return [data, status];
}


//todo refactor use createURLEncodedBody
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




//todo refactor to use api service and urlEncoded
export async function deactivateAccount(token: string, id: string, body: Record<string, any> = {}): Promise<[object, number]> {
    const url: string = constants.USER_ACCOUNT_ROUTE + "/" + id + constants.DEACTIVATION_ROUTE;
    const { data, status } = await apiService.api.post(
        url,
        qs.stringify(body),
        {
            headers: {
                ...apiService.getHeaders(token),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return [data, status];
}

//todo refactor to use api service and urlEncoded
export async function activateAccount(token: string, id: string, body: Record<string, any> = {}): Promise<[object, number]> {
    const url: string = constants.USER_ACCOUNT_ROUTE + "/" + id + constants.ACTIVATION_ROUTE;
    const { data, status } = await apiService.api.post(
        url,
        qs.stringify(body),
        {
            headers: {
                ...apiService.getHeaders(token),
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

