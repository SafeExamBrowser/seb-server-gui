// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OptionalParGeneric = {
    institutionId?: number;
    page_number?: number;
    page_size?: number;
    sort?: string;
    filterCriteria?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OptionalParInstitutionId = {
    institutionId?: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OptionalParGetQuizzes = {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OptionalParGetExams = {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OptionalParGetMonitoringClientLogs = {
    page_number?: number;
    page_size?: number;
    sort?: string;
    text?: string;
    type?: string;
};
