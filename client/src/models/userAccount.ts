export type UserAccountResponse = {
    numberOfPages: number;
    pageNumber: number;
    pageSize: number;
    content: UserAccount[];
}

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

export type UserAccountName = {
    modelId: string,
    entitiyType: string,
    name: string
}


export interface OptionalParGetUserAccounts {
    page_size?: number;
    page_number?: number;
    name?: string;
    start_timestamp_millis?: number;
    sort?: string;
}
