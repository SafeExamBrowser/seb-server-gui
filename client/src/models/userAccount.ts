import { z } from "zod";
import {
    zEntityName,
    zPageUserInfo,
    zPasswordChange,
    zUserInfo,
    zUserMod,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import { isoDateTimeCodec } from "@/models/codecs.ts";

// Other SEB Server clients store a missing email as "" — accept that on the
// wire, but keep the app model at "valid email or undefined" and never send
// "" back.
const emptyableEmailCodec = z.codec(
    z.union([zUserInfo.shape.email.unwrap(), z.literal("")]).optional(),
    zUserInfo.shape.email,
    {
        decode: (wire) => (wire === "" ? undefined : wire),
        encode: (app) => app,
    },
);

export const userAccountSchema = zUserInfo
    .pick({
        uuid: true,
        institutionId: true,
        name: true,
        surname: true,
        username: true,
        active: true,
        language: true,
        timezone: true,
        userRoles: true,
    })
    .extend({
        email: emptyableEmailCodec,
        creationDate: isoDateTimeCodec.optional(),
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
export type UserRole = (typeof USER_ROLES)[number];
