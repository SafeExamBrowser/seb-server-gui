export const USER_ACCOUNT_FIELD = {
    institutionId: "institutionId",
    username: "username",
    name: "name",
    surname: "surname",
    email: "email",
    timezone: "timezone",
    password: "password",
    confirmPassword: "confirmPassword",
    role: "role",
} as const;

export const userAccountFormConfig = {
    createRoute: "/user-account/create",
    createTestPrefix: "createUserAccount",
    editRoute: (userUuid: string) => `/user-account/${userUuid}`,
    editTestPrefix: "editUserAccount",
} as const;
