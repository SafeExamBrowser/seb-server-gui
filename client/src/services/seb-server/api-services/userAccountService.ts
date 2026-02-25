import * as newApiService from "@/services/newApiService";

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
        await newApiService
            .getApiForManualRequests()
            .post(`/register`, payload, {
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
        await newApiService.putRequest(`${baseUrl}/password`, {
            uuid,
            password,
            newPassword,
            confirmNewPassword,
        })
    ).data;

export const deleteUserAccount = async (accountId: string): Promise<unknown> =>
    (await newApiService.deleteRequest(`${baseUrl}/${accountId}`)).data;

export const getPersonalUserAccount = async (): Promise<UserAccount> =>
    (await newApiService.getRequest(`${baseUrl}/me`)).data;

export const getUserAccountById = async (
    accountId: string,
): Promise<UserAccount> =>
    (await newApiService.getRequest(`${baseUrl}/${accountId}`)).data;

export const getUserAccounts = async (
    optionalParameters?: OptionalParGetUserAccounts,
): Promise<UserAccountResponse> =>
    (await newApiService.getRequest(baseUrl, { params: optionalParameters }))
        .data;

export const createUserAccount = async (
    userAccount: CreateUserPar,
): Promise<SingleUserAccountResponse> =>
    (
        await newApiService.postRequest(baseUrl, userAccount, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
    ).data;

export const editUserAccount = async (
    userAccount: EditUserAccountParameters,
): Promise<UserAccountResponse> =>
    (await newApiService.putRequest(baseUrl, userAccount)).data;

export const getSupervisorNames = async (
    optionalParameters?: OptionalParInstitutionId,
): Promise<UserAccountName[]> =>
    (
        await newApiService.getRequest(`${baseUrl}/supervisors`, {
            params: optionalParameters,
        })
    ).data;

export const activateUserAccount = async (
    accountId: string,
): Promise<UserAccount> =>
    (
        await newApiService.postRequest(
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
        await newApiService.postRequest(
            `${baseUrl}/${accountId}/inactive`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;
