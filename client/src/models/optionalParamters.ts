type OptionalParGeneric = {
    institutionId?: number,
    page_number?: number;
    page_size?: number;
    sort?: string;
    filterCriteria?: string;
}

type OptionalParInstitutionId = {
    institutionId?: number,
}

type OptionalParGetQuizzes = {
    institutionId?: number,
    page_number?: number;
    page_size?: number;
    sort?: string;
    filterCriteria?: string;
    name?: string;
    start_timestamp_millis?: number;
    lms_setup?: string;
}

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
}