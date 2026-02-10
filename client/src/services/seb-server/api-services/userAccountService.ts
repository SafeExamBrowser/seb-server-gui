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

export const changePassword = async (
    uuid: string,
    password: string,
    newPassword: string,
    confirmNewPassword: string,
): Promise<SingleUserAccountResponse> =>
    (
        await newApiService.put(`${baseUrl}/password`, {
            uuid,
            password,
            newPassword,
            confirmNewPassword,
        })
    ).data;

export const deleteUserAccount = async (accountId: string): Promise<unknown> =>
    (await newApiService.deleteRequest(`${baseUrl}/${accountId}`)).data;

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

export const getUserAccounts = async (
    optionalParameters?: OptionalParGetUserAccounts,
): Promise<UserAccountResponse> =>
    (await newApiService.get(baseUrl, { params: optionalParameters })).data;

export const createUserAccount = async (
    userAccount: CreateUserPar,
): Promise<SingleUserAccountResponse> =>
    (
        await newApiService.post(baseUrl, userAccount, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
    ).data;

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

export const getSupervisorNames = async (
    optionalParameters?: OptionalParInstitutionId,
): Promise<UserAccountResponse> =>
    (
        await newApiService.get(`${baseUrl}/supervisors`, {
            params: optionalParameters,
        })
    ).data;

export const activateUserAccount = async (
    accountId: string,
): Promise<UserAccount> =>
    (
        await newApiService.post(
            `${baseUrl}/${accountId}/active`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

export const deactivateUserAccount = async (
    accountId: string,
): Promise<UserAccount> =>
    (
        await newApiService.post(
            `${baseUrl}/${accountId}/inactive`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;
