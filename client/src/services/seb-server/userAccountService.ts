import {
    activateUserAccount as activateUserAccountSdk,
    changeUserAccountPassword as changeUserAccountPasswordSdk,
    createUserAccount as createUserAccountSdk,
    deactivateUserAccount as deactivateUserAccountSdk,
    deleteUserAccount as deleteUserAccountSdk,
    editUserAccount as editUserAccountSdk,
    getCurrentUserAccount as getCurrentUserAccountSdk,
    getUserAccountById as getUserAccountByIdSdk,
    getUserAccounts as getUserAccountsSdk,
    getUserAccountSupervisors as getUserAccountSupervisorsSdk,
    registerUserAccount as registerUserAccountSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import type {
    EntityProcessingReport,
    GetUserAccountsData,
    GetUserAccountSupervisorsData,
    UserMod,
} from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { zEntityProcessingReport } from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    type UserAccount,
    type UserAccountCreateRequest,
    userAccountCreateSchema,
    type UserAccountName,
    userAccountNameSchema,
    type UserAccountPage,
    userAccountPageSchema,
    type UserAccountPasswordChange,
    userAccountPasswordChangeSchema,
    type UserAccountRegisterRequest,
    userAccountRegisterSchema,
    userAccountSchema,
} from "@/models/userAccount.ts";
import { decodeWire, encodeWire } from "@/services/errors/wireCodec.ts";

// TODO(backend): userRoles should not be mandatory on the register schema. The /register
// endpoint already assigns EXAM_SUPPORTER server-side; it is sent here only because the shared
// UserMod marks userRoles required. Once the backend exposes a register schema without a
// mandatory role, drop this and let userAccountRegisterSchema omit userRoles entirely.
const SELF_REGISTER_ROLES: UserMod["userRoles"] = ["EXAM_SUPPORTER"];

export const registerUserAccount = (
    body: UserAccountRegisterRequest,
): Promise<UserAccount> =>
    registerUserAccountSdk({
        client,
        body: {
            ...encodeWire(userAccountRegisterSchema, body),
            userRoles: SELF_REGISTER_ROLES,
        },
    }).then(({ data }) => decodeWire(userAccountSchema, data));

export const getUserAccounts = (
    query?: GetUserAccountsData["query"],
): Promise<UserAccountPage> =>
    getUserAccountsSdk({ client, query }).then(({ data }) =>
        decodeWire(userAccountPageSchema, data),
    );

export const getUserAccountById = (modelId: string): Promise<UserAccount> =>
    getUserAccountByIdSdk({
        client,
        path: { modelId },
    }).then(({ data }) => decodeWire(userAccountSchema, data));

export const getCurrentUserAccount = (): Promise<UserAccount> =>
    getCurrentUserAccountSdk({ client }).then(({ data }) =>
        decodeWire(userAccountSchema, data),
    );

export const getUserAccountSupervisors = (
    query?: GetUserAccountSupervisorsData["query"],
): Promise<UserAccountName[]> =>
    getUserAccountSupervisorsSdk({
        client,
        query,
    }).then(({ data }) =>
        (data ?? []).map((name) => decodeWire(userAccountNameSchema, name)),
    );

export const createUserAccount = (
    body: UserAccountCreateRequest,
): Promise<UserAccount> =>
    createUserAccountSdk({
        client,
        body: encodeWire(userAccountCreateSchema, body),
    }).then(({ data }) => decodeWire(userAccountSchema, data));

export const editUserAccount = (body: UserAccount): Promise<UserAccount> =>
    editUserAccountSdk({
        client,
        body: encodeWire(userAccountSchema, body),
    }).then(({ data }) => decodeWire(userAccountSchema, data));

export const changeUserAccountPassword = (
    body: UserAccountPasswordChange,
): Promise<UserAccount> =>
    changeUserAccountPasswordSdk({
        client,
        body: encodeWire(userAccountPasswordChangeSchema, body),
    }).then(({ data }) => decodeWire(userAccountSchema, data));

export const deleteUserAccount = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deleteUserAccountSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );

export const activateUserAccount = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    activateUserAccountSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );

export const deactivateUserAccount = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deactivateUserAccountSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );
