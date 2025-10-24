import { MetaData, Session } from "@/models/screen-proctoring/session";

export type ScreenshotGroup = {
    timestamp: number;
    metaData: MetaData;
};

export type SearchSessions = {
    numberOfPages: number;
    pageNumber: number;
    pageSize: number;
    sort: string;
    content: Session[];
};

export type SearchScreenshots = {
    numberOfPages: number;
    pageNumber: number;
    pageSize: number;
    sort: string;
    content: [
        {
            groupUUID: string;
            groupName: string;
            groupCreationTime: number;
            sessionUUID: string;
            sessionStartTime: number;
            sessionEndTime: number;
            sessionClientName: string;
            sessionClientIP: string;
            sessionClientMachineName: string;
            sessionClientOSName: string;
            sessionClientVersion: string;
            imageId: number;
            imageTimestamp: number;
            imageFormat: string;
            metaData: MetaData;
        },
    ];
};

export type SearchTimeline = {
    sessionUUID: string;
    timelineGroupDataList: [
        {
            groupOrder: number;
            groupName: string;
            timelineScreenshotDataList: ScreenshotGroup[];
        },
    ];
};

export type ScreenshotsGrouped = {
    groupName: string;
    timelineScreenshotDataList: ScreenshotGroup[];
};
