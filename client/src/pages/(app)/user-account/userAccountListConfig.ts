export const USER_ACCOUNT_COLUMN = {
    institutionId: "institutionId",
    surname: "surname",
    name: "name",
    username: "username",
    email: "email",
    active: "active",
} as const;

export const userAccountListConfig = {
    testIdBase: "userAccounts",
    route: "/user-account",
    itemKey: "uuid",
} as const;
