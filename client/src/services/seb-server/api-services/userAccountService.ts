import axios, { AxiosResponse } from "axios";
import * as ENV from "@/config/envConfig";
import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const userAccountUrl: string = "/useraccount";

export async function register(
    name: string,
    surname: string,
    username: string,
    newPassword: string,
    confirmNewPassword: string,
    email?: string,
    timezone?: string,
): Promise<UserAccount | any> {

    try {
        const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + userAccountUrl + "/register";

        const { data, status }: AxiosResponse = await axios.post(url, {
            name,
            surname,
            username,
            newPassword,
            confirmNewPassword,
            email,
            timezone
        });

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

export async function deactivateUserAccount(accountId: string): Promise<UserAccount | any> {
    try {
        const url: string = userAccountUrl + "/deactivate/" + accountId;
        const { data, status }: AxiosResponse = await apiService.api.post(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN) });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}



export async function getPersonalUserAccount(): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/me";
    return (await apiService.api.get(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN) })).data;
}

export async function getUserAccountById(accountId: string): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/" + accountId;
    return (await apiService.api.get(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN) })).data;
}

export async function getUserAccounts(optionalParamters?: OptionalParGeneric): Promise<UserAccountResponse[] | any> {
    const url: string = userAccountUrl;
    return (await apiService.api.get(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: { optionalParamters } })).data;
}

export async function getUserAccountNames(optionalParamters?: OptionalParInstitutionId): Promise<UserAccountName[] | any> {
    const url: string = userAccountUrl + "/names";
    return (await apiService.api.get(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: { optionalParamters } })).data;
}

export async function activateUserAccount(accountId: string): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/activate/" + accountId;
    return (await apiService.api.post(url, { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN) })).data;
}