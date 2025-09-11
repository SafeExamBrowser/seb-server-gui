import axios, { AxiosResponse } from "axios";
import * as ENV from "@/config/envConfig";
import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const userAccountUrl: string = "/useraccount";

export async function registerUserAccount(
    payload: Record<string, string>,
): Promise<UserAccount | any> {
    const url: string =
        ENV.SERVER_URL + ENV.SERVER_PORT + userAccountUrl + "/register";

    const { data, status }: AxiosResponse = await axios.post(url, payload);

    if (status === 200) {
        return data;
    }
}

export async function changePassword(
    uuid: string,
    password: string,
    newPassword: string,
    confirmNewPassword: string,
): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/password";

    const { data }: AxiosResponse = await apiService.api.put(
        url,
        {
            uuid,
            password,
            newPassword,
            confirmNewPassword,
        },
        { headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN) },
    );

    return data;
}

export async function deleteUserAccount(accountId: string): Promise<any | any> {
    return (
        await apiService.api.delete(userAccountUrl + "/" + accountId, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getPersonalUserAccount(): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/me";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getPersonalUserAccountFeatures(): Promise<any | any> {
    const url: string = userAccountUrl + "/me/features";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getUserAccountById(
    accountId: string,
): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/" + accountId;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getUserAccountByIdOptional(
    accountId: string,
): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/" + accountId;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { skip_error: "404" },
        })
    ).data;
}

export async function getUserAccounts(
    optionalParameters?: OptionalParGetUserAccounts,
): Promise<UserAccountResponse | any> {
    return (
        await apiService.api.get(userAccountUrl, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function createUserAccount(
    userAccount: CreateUserPar,
): Promise<SingleUserAccountResponse | any> {
    return (
        await apiService.api.post(userAccountUrl, userAccount, {
            headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function editUserAccount(
    userAccount: EditUserAccountParameters,
): Promise<UserAccountResponse | any> {
    return (
        await apiService.api.put(userAccountUrl, userAccount, {
            headers: apiService.getPutHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getUserAccountNames(
    optionalParameters?: OptionalParInstitutionId,
): Promise<UserAccountName[] | any> {
    const url: string = userAccountUrl + "/names";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function getSupervisorNames(
    optionalParameters?: OptionalParInstitutionId,
): Promise<UserAccountName[] | any> {
    const url: string = userAccountUrl + "/supervisors";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function activateUserAccount(
    accountId: string,
): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/" + accountId + "/active";
    return (
        await apiService.api.post(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function deactivateUserAccount(
    accountId: string,
): Promise<UserAccount | any> {
    const url: string = userAccountUrl + "/" + accountId + "/inactive";
    return (
        await apiService.api.post(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}
