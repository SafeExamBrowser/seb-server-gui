import * as apiService from "@/services/apiService";
import {
    CreateUserPar,
    EditUserAccountParameters,
    OptionalParGetUserAccounts,
    RegisterUserAccountParams,
    SingleUserAccountResponse,
    UserAccount,
    UserAccountName,
    UserAccountResponse,
} from "@/models/userAccount";

import { OptionalParInstitutionId } from "@/models/seb-server/optionalParamters";

const baseUrl = "/useraccount" as const;

export const registerUserAccount = async (
    payload: RegisterUserAccountParams,
): Promise<UserAccount> =>
    (
        await apiService.postRequest({
            url: `/register`,
            data: payload,
            options: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
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
        await apiService.putRequest({
            url: `${baseUrl}/password`,
            data: {
                uuid,
                password,
                newPassword,
                confirmNewPassword,
            },
            options: { _authType: "seb" },
        })
    ).data;

export const deleteUserAccount = async (accountId: string): Promise<unknown> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}/${accountId}`,
            options: { _authType: "seb" },
        })
    ).data;

export const getPersonalUserAccount = async (): Promise<UserAccount> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/me`,
            options: { _authType: "seb" },
        })
    ).data;

export const getUserAccountById = async (
    accountId: string,
): Promise<UserAccount> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${accountId}`,
            options: { _authType: "seb" },
        })
    ).data;

export const getUserAccounts = async (
    optionalParameters?: OptionalParGetUserAccounts,
): Promise<UserAccountResponse> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: { _authType: "seb", params: optionalParameters },
        })
    ).data;

export const createUserAccount = async (
    userAccount: CreateUserPar,
): Promise<SingleUserAccountResponse> =>
    (
        await apiService.postRequest({
            url: baseUrl,
            data: userAccount,
            options: { _authType: "seb" },
        })
    ).data;

export const editUserAccount = async (
    userAccount: EditUserAccountParameters,
): Promise<UserAccountResponse> =>
    (
        await apiService.putRequest({
            url: baseUrl,
            data: userAccount,
            options: { _authType: "seb" },
        })
    ).data;

export const getSupervisorNames = async (
    optionalParameters?: OptionalParInstitutionId,
): Promise<UserAccountName[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/supervisors`,
            options: {
                _authType: "seb",
                params: optionalParameters,
            },
        })
    ).data;

export const activateUserAccount = async (
    accountId: string,
): Promise<UserAccount> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${accountId}/active`,
            options: { _authType: "seb" },
        })
    ).data;

export const deactivateUserAccount = async (
    accountId: string,
): Promise<UserAccount> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${accountId}/inactive`,
            options: { _authType: "seb" },
        })
    ).data;
