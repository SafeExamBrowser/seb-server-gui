// Legacy assessment-tool (LMS setup) read types still consumed by the not-yet-migrated
// exam / exam-template domains via assessmentToolInfoService.ts. The assessment-tool domain
// itself uses the HeyAPI boundary model in @/models/assessmentTool.ts.
export type AssessmentTool = {
    id: number;
    institutionId: number;
    name: string;
    lmsType: string;
    lmsUrl: string;
    lmsClientname: string;
    lmsClientsecret: string;
    lmsRestApiToken: string;
    lmsProxyHost?: string;
    lmsProxyPort?: number;
    lmsProxyAuthUsername?: string;
    lmsProxyAuthSecret?: string;
    active: boolean;
    updateTime: number;
    connectionId: string;
    integrationActive: boolean;
};

export type AssessmentToolsResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    complete: boolean;
    content: AssessmentTool[];
};
