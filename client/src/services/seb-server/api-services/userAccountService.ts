import axios, {AxiosResponse} from "axios";
import * as ENV from "@/config/envConfig";
import * as apiService from "@/services/apiService";
import {StorageItemEnum} from "@/models/StorageItemEnum";

const userAccountUrl: string = "/useraccount";

export async function registerUserAccount(payload: Record<string, string>): Promise<UserAccount | any> {
    try {
        const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + userAccountUrl + "/register";

        const { data, status }: AxiosResponse = await axios.post(
            url,
            payload
        );

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}


export async function changePassword(
    uuid: string,
    password: string,
    newPassword: string,
    confirmNewPassword: string,
): Promise<UserAccount | any> {
    try {

        const url: string = userAccountUrl + "/changePassword";

        const { data, status }: AxiosResponse = await apiService.api.post(url, { uuid, password, newPassword, confirmNewPassword }, { headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN) });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}

export async function deleteUserAccount(accountId: string): Promise<any | any> {
    return (await apiService.api.delete(userAccountUrl + "/" + accountId, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;

}

export async function getPersonalUserAccount(): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/me";
    return (await apiService.api.get(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN) })).data;
}

export async function getUserAccountById(accountId: string): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/" + accountId;
    return (await apiService.api.get(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN) })).data;
}

export async function getUserAccounts(optionalParameters?: OptionalParGetUserAccounts): Promise<UserAccountResponse | any> {
    return (await apiService.api.get(userAccountUrl, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: { optionalParameters } })).data;
}

export async function createUserAccount(userAccount: createUserPar): Promise<SingleUserAccountResponse | any> {
    return (await apiService.api.post(userAccountUrl, userAccount, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}


// adjust endpoint to patch or maybe differnt path?
export async function editUserAccount(userAccount : UserAccount): Promise<UserAccountResponse | any> {
    return (await apiService.api.post(userAccountUrl, userAccount, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}
export async function getUserAccountNames(optionalParameters?: OptionalParInstitutionId): Promise<UserAccountName[] | any> {
    const url: string = userAccountUrl + "/names";
    return (await apiService.api.get(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: { optionalParameters } })).data;
}

export async function getSupervisorNames(optionalParameters?: OptionalParInstitutionId): Promise<UserAccountName[] | any> {
    const url: string = userAccountUrl + "/supervisors";
    return (await apiService.api.get(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: { optionalParameters } })).data;
}

export async function activateUserAccount(accountId: string): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/activate/" + accountId;
    return (await apiService.api.post(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN) })).data;
}
