import { ScreenshotData } from "@/models/screen-proctoring/session";
import { SPExamView } from "@/models/screen-proctoring/exam";

export type EntityPrivilege = {
    id: number;
    entityType: string;
    entityId: number;
    userUuid: string;
    privileges: string;
};

export type Group = {
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

export type GroupObject = {
    numberOfPages: number;
    pageNumber: number;
    pageSize: number;
    content: Group[];
};

export type GroupUuid = {
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
