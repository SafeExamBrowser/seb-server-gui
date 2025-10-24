export type DistinctMetadataWindowForExamRecord = {
    totalAmount: number;
    distinctWindowTitles: string[];
};

export type UserListForApplicationSearchRecord = {
    username: string;
    sessionUuid: string;
    firstScreenshotCaptureTime: number;
    count: number;
};
