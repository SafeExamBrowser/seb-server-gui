type UserAccount = {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UserAccountResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: UserAccount[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SingleUserAccountResponse = {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type EditUserAccountParameters = {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UserAccountName = {
    modelId: string;
    entityType: string;
    name: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CreateUserPar = {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OptionalParGetUserAccounts = {
    page_size?: number;
    page_number?: number;
    surname?: string;
    active?: string | null;
    institutionId?: string | null;
    sort?: string;
};
