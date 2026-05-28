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
import type {
    UserAccount,
    UserAccountCreateRequest,
    UserAccountPasswordChange,
} from "@/models/userAccount.ts";
import type { GetUserAccountsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import type { OptionalParInstitutionId } from "@/models/seb-server/optionalParamters";

type RequestOptions = { signal?: AbortSignal };

export const registerUserAccount = (body: UserAccountCreateRequest) =>
    registerUserAccountSdk({ client, body }).then((r) => r.data);

export const getUserAccounts = (
    query?: GetUserAccountsData["query"],
    options: RequestOptions = {},
) =>
    getUserAccountsSdk({ client, query, signal: options.signal }).then(
        (r) => r.data,
    );

export const getUserAccountById = (
    modelId: string,
    options: RequestOptions = {},
) =>
    getUserAccountByIdSdk({
        client,
        path: { modelId },
        signal: options.signal,
    }).then((r) => r.data);

export const getCurrentUserAccount = (options: RequestOptions = {}) =>
    getCurrentUserAccountSdk({ client, signal: options.signal }).then(
        (r) => r.data,
    );

export const getSupervisorNames = (
    query?: OptionalParInstitutionId,
    options: RequestOptions = {},
) =>
    getSupervisorNamesSdk({ client, query, signal: options.signal }).then(
        (r) => r.data,
    );

export const createUserAccount = (body: UserAccountCreateRequest) =>
    createUserAccountSdk({ client, body }).then((r) => r.data);

export const editUserAccount = (body: UserAccount) =>
    editUserAccountSdk({ client, body }).then((r) => r.data);

export const changeUserAccountPassword = (body: UserAccountPasswordChange) =>
    changeUserAccountPasswordSdk({ client, body }).then((r) => r.data);

export const deleteUserAccount = (modelId: string) =>
    deleteUserAccountSdk({ client, path: { modelId } }).then((r) => r.data);

export const activateUserAccount = (modelId: string) =>
    activateUserAccountSdk({ client, path: { modelId } }).then((r) => r.data);

export const deactivateUserAccount = (modelId: string) =>
    deactivateUserAccountSdk({ client, path: { modelId } }).then((r) => r.data);
