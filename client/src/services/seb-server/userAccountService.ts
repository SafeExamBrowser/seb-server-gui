import { z } from "zod";
import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    activateUserAccount as activateUserAccountSdk,
    changeUserAccountPassword as changeUserAccountPasswordSdk,
    createUserAccount as createUserAccountSdk,
    deactivateUserAccount as deactivateUserAccountSdk,
    deleteUserAccount as deleteUserAccountSdk,
    editUserAccount as editUserAccountSdk,
    getCurrentUserAccount as getCurrentUserAccountSdk,
    getUserAccountById as getUserAccountByIdSdk,
    getUserAccountSupervisors as getUserAccountSupervisorsSdk,
    getUserAccounts as getUserAccountsSdk,
    registerUserAccount as registerUserAccountSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import {
    userAccountCreateSchema,
    userAccountNameSchema,
    userAccountPageSchema,
    userAccountPasswordChangeSchema,
    userAccountSchema,
    type UserAccount,
    type UserAccountCreateRequest,
    type UserAccountName,
    type UserAccountPage,
    type UserAccountPasswordChange,
} from "@/models/userAccount.ts";
import { zEntityProcessingReport } from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import type {
    EntityProcessingReport,
    GetUserAccountSupervisorsData,
    GetUserAccountsData,
} from "@/api/seb-server/generated/hey-api/types.gen.ts";

type RequestOptions = { signal?: AbortSignal };

export const registerUserAccount = (
    body: UserAccountCreateRequest,
): Promise<UserAccount> =>
    registerUserAccountSdk({
        client,
        body: z.encode(userAccountCreateSchema, body),
    }).then(({ data }) => z.decode(userAccountSchema, data));

export const getUserAccounts = (
    query?: GetUserAccountsData["query"],
    opts?: RequestOptions,
): Promise<UserAccountPage> =>
    getUserAccountsSdk({ client, query, signal: opts?.signal }).then(
        ({ data }) => z.decode(userAccountPageSchema, data),
    );

export const getUserAccountById = (
    modelId: string,
    opts?: RequestOptions,
): Promise<UserAccount> =>
    getUserAccountByIdSdk({
        client,
        path: { modelId },
        signal: opts?.signal,
    }).then(({ data }) => z.decode(userAccountSchema, data));

export const getCurrentUserAccount = (
    opts?: RequestOptions,
): Promise<UserAccount> =>
    getCurrentUserAccountSdk({ client, signal: opts?.signal }).then(
        ({ data }) => z.decode(userAccountSchema, data),
    );

export const getUserAccountSupervisors = (
    query?: GetUserAccountSupervisorsData["query"],
    opts?: RequestOptions,
): Promise<UserAccountName[]> =>
    getUserAccountSupervisorsSdk({
        client,
        query,
        signal: opts?.signal,
    }).then(({ data }) =>
        (data ?? []).map((name) => z.decode(userAccountNameSchema, name)),
    );

export const createUserAccount = (
    body: UserAccountCreateRequest,
): Promise<UserAccount> =>
    createUserAccountSdk({
        client,
        body: z.encode(userAccountCreateSchema, body),
    }).then(({ data }) => z.decode(userAccountSchema, data));

export const editUserAccount = (body: UserAccount): Promise<UserAccount> =>
    editUserAccountSdk({
        client,
        body: z.encode(userAccountSchema, body),
    }).then(({ data }) => z.decode(userAccountSchema, data));

export const changeUserAccountPassword = (
    body: UserAccountPasswordChange,
): Promise<UserAccount> =>
    changeUserAccountPasswordSdk({
        client,
        body: z.encode(userAccountPasswordChangeSchema, body),
    }).then(({ data }) => z.decode(userAccountSchema, data));

export const deleteUserAccount = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deleteUserAccountSdk({ client, path: { modelId } }).then(({ data }) =>
        z.decode(zEntityProcessingReport, data),
    );

export const activateUserAccount = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    activateUserAccountSdk({ client, path: { modelId } }).then(({ data }) =>
        z.decode(zEntityProcessingReport, data),
    );

export const deactivateUserAccount = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deactivateUserAccountSdk({ client, path: { modelId } }).then(({ data }) =>
        z.decode(zEntityProcessingReport, data),
    );
