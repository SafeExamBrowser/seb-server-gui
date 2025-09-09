// type OptionalParGeneric = {
//     pageNumber?: number;
//     pageSize?: number;
//     sort?: string;
//     filterCriteria?: string;
// }

type OptionalParGroups = {
    pageNumber?: number;
    pageSize?: number;
    sort?: string;
    includePastExams?: boolean | null;
    includeUpcomingExams?: boolean | null;
};

type OptionalParGroupByUuid = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
    filterCriteria?: string;
};

type OptionalParSearchSessions = {
    examName?: string | null;
    groupUUID?: string;
    groupName?: string | null;
    sessionUUID?: string;
    fromTime?: string;
    toTime?: string;
    clientName?: string | null;
    clientIp?: string | null;
    clientMachineName?: string | null;
    clientOsName?: string;
    clientVersion?: string;

    screenProctoringMetadataApplication?: string | null;
    screenProctoringMetadataBrowser?: string | null;
    screenProctoringMetadataUserAction?: string | null;
    screenProctoringMetadataURL?: string | null;
    screenProctoringMetadataWindowTitle?: string | null;

    pageNumber?: number;
    pageSize?: number;
    sort?: string;
};

type OptionalParSearchScreenshots = {
    groupUUID?: string;
    groupName?: string;
    sessionUUID?: string;
    fromTime?: string;
    toTime?: string;
    clientName?: string;
    clientIP?: string | null;
    clientMachineName?: string;
    clientOsName?: string;
    clientVersion?: string;

    screenProctoringMetadataApplication?: string | null;
    screenProctoringMetadataBrowser?: string | null;
    screenProctoringMetadataUserAction?: string | null;
    screenProctoringMetadataURL?: string | null;
    screenProctoringMetadataWindowTitle?: string | null;

    pageNumber?: number;
    pageSize?: number;
    sort?: string;
};

type OptionalParSearchTimeline = {
    screenProctoringMetadataApplication?: string | null;
    screenProctoringMetadataBrowser?: string | null;
    screenProctoringMetadataUserAction?: string | null;
    screenProctoringMetadataURL?: string | null;
    screenProctoringMetadataWindowTitle?: string | null;
};

type OptionalParGetExamsStarted = {
    fromTime?: string;
    toTime?: string;
};
