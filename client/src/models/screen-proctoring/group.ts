type EntityPrivilege = {
    id: number;
    entityType: string;
    entityId: number;
    userUuid: string;
    privileges: string;
};

type Group = {
    id: number;
    uuid: string;
    name: string;
    description: string;
    owner: string;
    creationTime: number;
    lastUpdateTime: number;
    terminationTime: number;
    entityPrivileges: EntityPrivilege[];
    active: boolean;
    exam: SPExamView;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type GroupObject = {
    numberOfPages: number;
    pageNumber: number;
    pageSize: number;
    content: Group[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type GroupUuid = {
    uuid: string;
    name: string;
    description: string;
    numberOfLiveSessions: number;
    numberOfSessions: number;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortOrder: string;
    screenshots: ScreenshotData[];
    exam: SPExamView;
};
