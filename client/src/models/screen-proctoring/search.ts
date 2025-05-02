type SearchSessions = {
    numberOfPages: number,
    pageNumber: number,
    pageSize: number,
    sort: string,
    content: Session[]
}

type SearchScreenshots = {
    numberOfPages: number,
    pageNumber: number,
    pageSize: number,
    sort: string,
    content: [
        {
            groupUUID: string,
            groupName: string,
            groupCreationTime: number,
            sessionUUID: string,
            sessionStartTime: number,
            sessionEndTime: number,
            sessionClientName: string,
            sessionClientIP: string,
            sessionClientMachineName: string,
            sessionClientOSName: string,
            sessionClientVersion: string,
            imageId: number,
            imageTimestamp: number,
            imageFormat: string,
            metaData: MetaData
        }
    ]
}

type SearchTimeline = {
    sessionUUID: string,
    timelineGroupDataList: [
        {
            groupOrder: number,
            groupName: string,
            timelineScreenshotDataList: ScreenshotGroup[]
        }
    ]

}

type ScreenshotsGrouped = {
    groupName: string,
    timelineScreenshotDataList: ScreenshotGroup[]
}

type ScreenshotGroup = {   
    timestamp: number,
    metaData: MetaData
}

type SessionsGrouped = {
    numberOfPages: number,
    pageNumber: number,
    pageSize: number,
    sort: string,
    content: [
        {
            day: string,
            sessions: Session[]
        }
    ]
}