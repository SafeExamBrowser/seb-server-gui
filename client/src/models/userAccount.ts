import { z } from "zod";
import {
    zEntityName,
    zPageUserInfo,
    zPasswordChange,
    zUserInfo,
    zUserMod,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";

export const userAccountSchema = zUserInfo.pick({
    uuid: true,
    institutionId: true,
    creationDate: true,
    name: true,
    surname: true,
    username: true,
    email: true,
    active: true,
    language: true,
    timezone: true,
    userRoles: true,
});
export type UserAccount = z.infer<typeof userAccountSchema>;

export const userAccountPageSchema = zPageUserInfo
    .pick({
        number_of_pages: true,
        page_number: true,
        page_size: true,
        sort: true,
    })
    .extend({ content: z.array(userAccountSchema).optional() });
export type UserAccountPage = z.infer<typeof userAccountPageSchema>;

export const userAccountCreateSchema = zUserMod.pick({
    institutionId: true,
    name: true,
    surname: true,
    username: true,
    email: true,
    language: true,
    timezone: true,
    userRoles: true,
    newPassword: true,
    confirmNewPassword: true,
});
export type UserAccountCreateRequest = z.infer<typeof userAccountCreateSchema>;

export const userAccountPasswordChangeSchema = zPasswordChange.pick({
    uuid: true,
    password: true,
    newPassword: true,
    confirmNewPassword: true,
});
export type UserAccountPasswordChange = z.infer<
    typeof userAccountPasswordChangeSchema
>;

export const userAccountNameSchema = zEntityName.pick({
    modelId: true,
    name: true,
});
export type UserAccountName = z.infer<typeof userAccountNameSchema>;

export const USER_ROLES = userAccountSchema.shape.userRoles.element.options;
export type UserAccountRole = (typeof USER_ROLES)[number];

export const UserRole = {
    SEB_SERVER_ADMIN: "SEB_SERVER_ADMIN",
    INSTITUTIONAL_ADMIN: "INSTITUTIONAL_ADMIN",
    EXAM_ADMIN: "EXAM_ADMIN",
    EXAM_SUPPORTER: "EXAM_SUPPORTER",
    TEACHER: "TEACHER",
} as const satisfies Record<UserAccountRole, UserAccountRole>;
