import * as newApiService from "@/services/newApiService";

import axios, { AxiosResponse } from "axios";
import * as ENV from "@/config/envConfig";
import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import {
    CreateUserPar,
    EditUserAccountParameters,
    OptionalParGetUserAccounts,
    SingleUserAccountResponse,
    UserAccount,
    UserAccountName,
    UserAccountResponse,
} from "@/models/userAccount";
import { OptionalParInstitutionId } from "@/models/seb-server/optionalParamters";

const userAccountUrl = "/useraccount";
const baseUrl = "/useraccount" as const;

export async function registerUserAccount(
    payload: Record<string, string>,
): Promise<UserAccount> {
    const url = ENV.SERVER_URL + ENV.SERVER_PORT + userAccountUrl + "/register";
    const { data, status }: AxiosResponse<UserAccount> =
        await axios.post<UserAccount>(url, payload);
    if (status === 200) return data;
    throw new Error(`Unexpected status ${status} for registerUserAccount`);
}

export async function changePassword(
    uuid: string,
    password: string,
    newPassword: string,
    confirmNewPassword: string,
): Promise<UserAccount[]> {
    const url = userAccountUrl + "/password";
    const { data }: AxiosResponse<UserAccount[]> = await apiService.api.put<
        UserAccount[]
    >(
        url,
        { uuid, password, newPassword, confirmNewPassword },
        { headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN) },
    );
    return data;
}

export async function deleteUserAccount(accountId: string): Promise<void> {
    await apiService.api.delete<unknown>(userAccountUrl + "/" + accountId, {
        headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
    });
}

export const getPersonalUserAccount = async (): Promise<UserAccount> =>
    (await newApiService.get(`${baseUrl}/me`)).data;

export type UserFeatures = unknown;

export async function getPersonalUserAccountFeatures(): Promise<UserFeatures> {
    const url = userAccountUrl + "/me/features";
    const { data }: AxiosResponse<UserFeatures> =
        await apiService.api.get<UserFeatures>(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        });
    return data;
}

export const getUserAccountById = async (
    accountId: string,
): Promise<UserAccount> =>
    (await newApiService.get(`${baseUrl}/${accountId}`)).data;

export async function getUserAccounts(
    optionalParameters?: OptionalParGetUserAccounts,
): Promise<UserAccountResponse> {
    const { data }: AxiosResponse<UserAccountResponse> =
        await apiService.api.get<UserAccountResponse>(userAccountUrl, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        });
    return data;
}

export async function createUserAccount(
    userAccount: CreateUserPar,
): Promise<SingleUserAccountResponse> {
    const { data }: AxiosResponse<SingleUserAccountResponse> =
        await apiService.api.post<SingleUserAccountResponse>(
            userAccountUrl,
            userAccount,
            {
                headers: apiService.getPostHeaders(
                    StorageItemEnum.ACCESS_TOKEN,
                ),
            },
        );
    return data;
}

export async function editUserAccount(
    userAccount: EditUserAccountParameters,
): Promise<UserAccountResponse> {
    return (
        await apiService.api.put(userAccountUrl, userAccount, {
            headers: apiService.getPutHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getUserAccountNames(
    optionalParameters?: OptionalParInstitutionId,
): Promise<UserAccountName[]> {
    const url = userAccountUrl + "/names";
    const { data }: AxiosResponse<UserAccountName[]> = await apiService.api.get<
        UserAccountName[]
    >(url, {
        headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        params: { optionalParameters },
    });
    return data;
}

export async function getSupervisorNames(
    optionalParameters?: OptionalParInstitutionId,
): Promise<UserAccountName[]> {
    const url = userAccountUrl + "/supervisors";
    const { data }: AxiosResponse<UserAccountName[]> = await apiService.api.get<
        UserAccountName[]
    >(url, {
        headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        params: { optionalParameters },
    });
    return data;
}

export async function activateUserAccount(
    accountId: string,
): Promise<UserAccount> {
    const url = userAccountUrl + "/" + accountId + "/active";
    const { data }: AxiosResponse<UserAccount> =
        await apiService.api.post<UserAccount>(url, null, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        });
    return data;
}

export async function deactivateUserAccount(
    accountId: string,
): Promise<UserAccount> {
    const url = userAccountUrl + "/" + accountId + "/inactive";
    const { data }: AxiosResponse<UserAccount> =
        await apiService.api.post<UserAccount>(url, null, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        });
    return data;
}
