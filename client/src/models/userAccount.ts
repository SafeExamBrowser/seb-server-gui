type UserAccountResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: UserAccount[];
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

type OptionalParGetUserAccounts = {
    page_size?: number;
    page_number?: number;
    name?: string;
    start_timestamp_millis?: number;
    sort?: string;
}
