import { zUserInfo } from "@/api/seb-server/generated/hey-api/zod.gen.ts";
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

export const USER_ROLES = zUserInfo.shape.userRoles.element.options;
export type UserAccountRole = (typeof USER_ROLES)[number];

export const UserRole = {
    SEB_SERVER_ADMIN: "SEB_SERVER_ADMIN",
    INSTITUTIONAL_ADMIN: "INSTITUTIONAL_ADMIN",
    EXAM_ADMIN: "EXAM_ADMIN",
    EXAM_SUPPORTER: "EXAM_SUPPORTER",
    TEACHER: "TEACHER",
} as const satisfies Record<UserAccountRole, UserAccountRole>;
