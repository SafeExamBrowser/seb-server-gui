export type UserAccount = {
    id: number;
    institutionId: number;
    uuid: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    language: string;
    timezone: string;
    userRoles: string[];
    creationTime: number;
    active: boolean;
    lastUpdateTime: number;
    terminationTime?: number | null;
    creationDate: string;
};

export type UserAccountResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: UserAccount[];
};

export type SingleUserAccountResponse = {
    uuid: string;
    institutionId: number;
    creationDate: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    active: boolean;
    directLogin: boolean;
    localAccount: boolean;
    language: string;
    timezone: string;
    userRoles: string[];
};

export type EditUserAccountParameters = {
    uuid: string;
    institutionId: number;
    creationDate: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    active: boolean;
    language: string;
    timezone: string;
    userRoles: string[];
};

export type UserAccountName = {
    modelId: string;
    entityType: string;
    name: string;
};

export type CreateUserPar = {
    institutionId: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    language: string;
    timezone: string;
    userRoles: string[];
    newPassword: string;
    confirmNewPassword: string;
};

export type OptionalParGetUserAccounts = {
    page_size?: number;
    page_number?: number;
    surname?: string;
    active?: string | null;
    institutionId?: string | null;
    sort?: string;
};
