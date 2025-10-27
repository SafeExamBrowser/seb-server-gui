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

export type OptionalParGetQuizzes = {
    institutionId?: number;
    page_number?: number;
    page_size?: number;
    sort?: string;
    filterCriteria?: string;
    name?: string;
    start_timestamp_millis?: number;
    start_timestamp?: string;
    lms_setup?: string;
    force_new_search: boolean;
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
