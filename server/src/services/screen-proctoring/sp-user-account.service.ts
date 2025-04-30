import * as ENV from "../../config/envConfig";
import * as apiService from "./sp-api.service";
import axios from "axios";
import * as utils from "../../utils/utils";

//does not use the pre-configured api-serice --> calls an unprotected api on the sp-server
const unprotectedUrl = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT;

export async function registerUserAccount(userData: {}): Promise<[object, number]>{
    const encodedCredentials: string = utils.createEncodedCredentials(ENV.PROCTOR_SERVER_USERNAME, ENV.PROCTOR_SERVER_PASSWORD);
    const url = unprotectedUrl + "/register";

    const {data, status} = await axios.post(url, userData, {headers: apiService.getAuthorizationHeadersBasic(encodedCredentials)});

    return [data, status];
}
//-----------------------------------------------------------------------//

const userAccountUrl: string = "/useraccount";

export async function changePassword(token: string, userData: {}): Promise<[object, number]>{
    const url = userAccountUrl + "/password";
    const {data, status} = await apiService.api.put(url, userData, {headers: apiService.getPutHeaders(token)});
    
    return [data, status];
}

export async function getPersonalUserAccount(token: string){
    const url: string = userAccountUrl + "/me";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function getUserAccountById(token: string, accountId: string): Promise<[object, number]>{
    const url: string = userAccountUrl + "/" + accountId;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function getUserAccounts(token: string, options?: {}): Promise<[object, number]>{
    const url: string = userAccountUrl;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}

export async function activateUserAccount(token: string, accountId: string): Promise<[object, number]>{
    const url: string = userAccountUrl + "/" + accountId + "/active";
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function deactivateUserAccount(token: string, accountId: string): Promise<[object, number]>{
    const url: string = userAccountUrl + "/" + accountId + "/inactive";
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});

    return [data, status];
}