import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    activateUserAccount as activateUserAccountSdk,
    changeUserAccountPassword as changeUserAccountPasswordSdk,
    createUserAccount as createUserAccountSdk,
    deactivateUserAccount as deactivateUserAccountSdk,
    deleteUserAccount as deleteUserAccountSdk,
    editUserAccount as editUserAccountSdk,
    getCurrentUserAccount as getCurrentUserAccountSdk,
    getSupervisorNames as getSupervisorNamesSdk,
    getUserAccountById as getUserAccountByIdSdk,
    getUserAccounts as getUserAccountsSdk,
    registerUserAccount as registerUserAccountSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import {
    zActivateUserAccountResponse,
    zChangeUserAccountPasswordResponse,
    zCreateUserAccountResponse,
    zDeactivateUserAccountResponse,
    zDeleteUserAccountResponse,
    zEditUserAccountResponse,
    zGetCurrentUserAccountResponse,
    zGetSupervisorNamesResponse,
    zGetUserAccountByIdResponse,
    zGetUserAccountsResponse,
    zRegisterUserAccountResponse,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import type {
    UserAccount,
    UserAccountCreateRequest,
    UserAccountPasswordChange,
} from "@/models/userAccount.ts";
import type { GetUserAccountsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import type { OptionalParInstitutionId } from "@/models/seb-server/optionalParamters";

type RequestOptions = { signal?: AbortSignal };

export const registerUserAccount = (body: UserAccountCreateRequest) =>
    registerUserAccountSdk({ client, body }).then(({ data }) =>
        zRegisterUserAccountResponse.parse(data),
    );

export const getUserAccounts = (
    query?: GetUserAccountsData["query"],
    opts?: RequestOptions,
) =>
    getUserAccountsSdk({ client, query, signal: opts?.signal }).then(
        ({ data }) => zGetUserAccountsResponse.parse(data),
    );

export const getUserAccountById = (modelId: string, opts?: RequestOptions) =>
    getUserAccountByIdSdk({
        client,
        path: { modelId },
        signal: opts?.signal,
    }).then(({ data }) => zGetUserAccountByIdResponse.parse(data));

export const getCurrentUserAccount = (opts?: RequestOptions) =>
    getCurrentUserAccountSdk({ client, signal: opts?.signal }).then(
        ({ data }) => zGetCurrentUserAccountResponse.parse(data),
    );

export const getSupervisorNames = (
    query?: OptionalParInstitutionId,
    opts?: RequestOptions,
) =>
    getSupervisorNamesSdk({ client, query, signal: opts?.signal }).then(
        ({ data }) => zGetSupervisorNamesResponse.parse(data),
    );

export const createUserAccount = (body: UserAccountCreateRequest) =>
    createUserAccountSdk({ client, body }).then(({ data }) =>
        zCreateUserAccountResponse.parse(data),
    );

export const editUserAccount = (body: UserAccount) =>
    editUserAccountSdk({ client, body }).then(({ data }) =>
        zEditUserAccountResponse.parse(data),
    );

export const changeUserAccountPassword = (body: UserAccountPasswordChange) =>
    changeUserAccountPasswordSdk({ client, body }).then(({ data }) =>
        zChangeUserAccountPasswordResponse.parse(data),
    );

export const deleteUserAccount = (modelId: string) =>
    deleteUserAccountSdk({ client, path: { modelId } }).then(({ data }) =>
        zDeleteUserAccountResponse.parse(data),
    );

export const activateUserAccount = (modelId: string) =>
    activateUserAccountSdk({ client, path: { modelId } }).then(({ data }) =>
        zActivateUserAccountResponse.parse(data),
    );

export const deactivateUserAccount = (modelId: string) =>
    deactivateUserAccountSdk({ client, path: { modelId } }).then(({ data }) =>
        zDeactivateUserAccountResponse.parse(data),
    );
