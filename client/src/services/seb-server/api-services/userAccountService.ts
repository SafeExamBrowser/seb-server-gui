import * as apiService from "@/services/apiService";

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

const baseUrl = "/useraccount" as const;

export const registerUserAccount = async (
    payload: Record<string, string>,
): Promise<UserAccount> =>
    (
        await apiService.getApiForManualRequests().post(`/register`, payload, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
    ).data;

export const changePassword = async (
    uuid: string,
    password: string,
    newPassword: string,
    confirmNewPassword: string,
): Promise<UserAccount[]> =>
    (
        await apiService.putRequest(`${baseUrl}/password`, {
            uuid,
            password,
            newPassword,
            confirmNewPassword,
        })
    ).data;

export const deleteUserAccount = async (accountId: string): Promise<unknown> =>
    (await apiService.deleteRequest(`${baseUrl}/${accountId}`)).data;

export const getPersonalUserAccount = async (): Promise<UserAccount> =>
    (await apiService.getRequest(`${baseUrl}/me`)).data;

export const getUserAccountById = async (
    accountId: string,
): Promise<UserAccount> =>
    (await apiService.getRequest(`${baseUrl}/${accountId}`)).data;

export const getUserAccounts = async (
    optionalParameters?: OptionalParGetUserAccounts,
): Promise<UserAccountResponse> =>
    (await apiService.getRequest(baseUrl, { params: optionalParameters })).data;

export const createUserAccount = async (
    userAccount: CreateUserPar,
): Promise<SingleUserAccountResponse> =>
    (
        await apiService.postRequest(baseUrl, userAccount, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
    ).data;

export const editUserAccount = async (
    userAccount: EditUserAccountParameters,
): Promise<UserAccountResponse> =>
    (await apiService.putRequest(baseUrl, userAccount)).data;

export const getSupervisorNames = async (
    optionalParameters?: OptionalParInstitutionId,
): Promise<UserAccountName[]> =>
    (
        await apiService.getRequest(`${baseUrl}/supervisors`, {
            params: optionalParameters,
        })
    ).data;

export const activateUserAccount = async (
    accountId: string,
): Promise<UserAccount> =>
    (
        await apiService.postRequest(
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
        await apiService.postRequest(
            `${baseUrl}/${accountId}/inactive`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;
