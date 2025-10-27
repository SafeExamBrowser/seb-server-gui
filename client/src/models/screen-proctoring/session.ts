// todo: change name

import { SPExamView } from "@/models/screen-proctoring/exam";

export type MetaData = {
    screenProctoringMetadataApplication?: string;
    screenProctoringMetadataBrowser?: string;
    screenProctoringMetadataUserAction?: string;
    screenProctoringMetadataURL?: string;
    screenProctoringMetadataWindowTitle?: string;
};

export type ScreenshotData = {
    startTime: number;
    timestamp: number;
    endTime: number;
    active: boolean;
    uuid: string;
    clientName: string;
    clientIp: string;
    clientMachineName: string;
    clientOsName: string;
    clientVersion: string;
    imageFormat: string;
    latestImageLink: string;
    imageLink: string;
    metaData: MetaData;
};

export type Session = {
    groupUUID: string;
    groupName: string;
    groupCreationTime: number;
    sessionUUID: string;
    startTime: number;
    endTime: number;
    clientName: string;
    clientIp: string;
    clientMachineName: string;
    clientOsName: string;
    clientVersion: string;
    imageFormat: string;
    nrOfScreenshots: number;
    exam: SPExamView;
};
