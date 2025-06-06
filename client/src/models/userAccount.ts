type UserAccountResponse = {
    numberOfPages: number;
    pageNumber: number;
    pageSize: number;
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
    lastUpdateTime: number;
    terminationTime?: number | null;
    creationDate: string;
};

type UserAccountName = {
    modelId: string,
    entitiyType: string,
    name: string
}