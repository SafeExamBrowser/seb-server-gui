type UserAccountResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: UserAccount[];
}
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
}

type EditUserAccountParameters= {
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

type UserAccountName = {
    modelId: string,
    entitiyType: string,
    name: string
}
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


type OptionalParGetUserAccounts = {
    page_size?: number;
    page_number?: number;
    surname?: string;
    active?: string | null;
    institutionId?: string | null;
    sort?: string;
}
