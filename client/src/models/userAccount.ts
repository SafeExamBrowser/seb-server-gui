type UserAccountResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: UserAccount[];
}
type SingleUserAccountResponse = {
    content: UserAccount;
}

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
type createUserPar = {
    institutionId: number;
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
    username?: string;
    status?: string | null
    sort?: string;
}
