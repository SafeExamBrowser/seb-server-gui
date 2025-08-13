type AssessmentToolsResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    complete: boolean;
    content: AssessmentTool[];
}


type AssessmentTool = {
    id: number;
    institutionId: number;
    name: string;
    lmsType: string;
    lmsUrl: string;
    lmsClientname: string;
    lmsClientsecret: string;
    lmsRestApiToken: string;
    lmsProxyHost: string;
    lmsProxyPort: number;
    lmsProxyAuthUsername: string;
    lmsProxyAuthSecret: string;
    active: boolean;
    updateTime: number;
    connectionId: string;
    integrationActive: boolean;
}


type OptionalParGetAssessmentTool = {
    page_size?: number;
    page_number?: number;
    status?: string | null
    sort?: string;
}



type CreateAssessmentToolPar = {
    institutionId: string;
    name: string;
    lmsType: string;
    lmsUrl: string;
    lmsClientname: string;
    lmsClientsecret: string;
    lmsRestApiToken?: string;

    //proxy
    lmsProxyHost? : string;
    lmsProxyPort? : string;
    lmsProxyAuthUsername?: string;
    lmsProxyAuthSecret? : string;
};


type UpdateAssessmentToolPar = {
    id: string;
    institutionId: string;
    name: string;
    lmsType: string;
    lmsUrl: string;
    lmsClientname: string;
    lmsClientsecret: string;
    lmsRestApiToken: string;
    // proxy
    lmsProxyHost?: string;
    lmsProxyPort?: number;
    lmsProxyAuthUsername?: string;
    lmsProxyAuthSecret?: string;
}
