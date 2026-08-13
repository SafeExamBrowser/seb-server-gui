export type OptionalParGeneric = {
    institutionId?: number;
    page_number?: number;
    page_size?: number;
    sort?: string;
    filterCriteria?: string;
};

export type OptionalParInstitutionId = {
    institutionId?: number;
};

export type OptionalParGetExams = {
    institutionId?: number;
    page_number?: number;
    page_size?: number;
    sort?: string;
    // filterCriteria?: string;
    quizStartTime?: string;
    quizName?: string;
    active?: string;
    status?: string;
    type?: string;
    start_timestamp_millis?: number;
};

export type OptionalParGetMonitoringClientLogs = {
    page_number?: number;
    page_size?: number;
    sort?: string;
    text?: string;
    type?: string;
};
