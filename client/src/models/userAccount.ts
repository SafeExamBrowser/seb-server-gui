import type {
    EntityName,
    PageUserInfo,
    PasswordChange,
    UserInfo,
    UserMod,
} from "@/api/seb-server/generated/hey-api/types.gen.ts";

export type UserAccount = UserInfo;
export type UserAccountResponse = PageUserInfo;
export type UserAccountName = EntityName;
export type UserAccountCreateRequest = UserMod;
export type UserAccountPasswordChange = PasswordChange;

export type UserAccountRole = UserInfo["userRoles"][number];
