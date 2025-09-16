type ScreenshotGroup = {
    timestamp: number;
    metaData: MetaData;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SearchSessions = {
    numberOfPages: number;
    pageNumber: number;
    pageSize: number;
    sort: string;
    content: Session[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SearchScreenshots = {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SearchTimeline = {
    sessionUUID: string;
    timelineGroupDataList: [
        {
            groupOrder: number;
            groupName: string;
            timelineScreenshotDataList: ScreenshotGroup[];
        },
    ];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ScreenshotsGrouped = {
    groupName: string;
    timelineScreenshotDataList: ScreenshotGroup[];
};
