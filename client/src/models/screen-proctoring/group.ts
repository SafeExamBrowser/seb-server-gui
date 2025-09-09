type GroupObject = {
    numberOfPages: number;
    pageNumber: number;
    pageSize: number;
    content: Group[];
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

type EntityPrivilege = {
    id: number;
    entityType: string;
    entityId: number;
    userUuid: string;
    privileges: string;
};

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
