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
    start_timestamp?: string;
}