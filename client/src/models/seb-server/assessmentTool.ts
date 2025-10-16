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

export enum LMSTypeEnum {
    MOCKUP = "MOCKUP",
    OPEN_EDX = "OPEN_EDX",
    MOODLE = "MOODLE",
    MOODLE_PLUGIN = "MOODLE_PLUGIN",
    ANS_DELFT = "ANS_DELFT",
    OPEN_OLAT = "OPEN_OLAT",
}

export type OptionalParGetAssessmentTool = {
    page_size?: number;
    page_number?: number;
    sort?: string;
    name?: string;

    lms_type?: LMSTypeEnum | null;
    active?: string | null;
    institutionId?: string | null;
};

export type CommonAssessmentToolPar = {
    institutionId: string;
    name: string;
    lmsType: string;
    lmsUrl: string;
    // proxy (unchanged)
    lmsProxyHost?: string;
    lmsProxyPort?: string;
    lmsProxyAuthUsername?: string;
    lmsProxyAuthSecret?: string;
};

export type CreateAssessmentToolPar =
    | (CommonAssessmentToolPar & {
          authMode: "token";
          lmsRestApiToken: string;
          lmsClientname?: never;
          lmsClientsecret?: never;
      })
    | (CommonAssessmentToolPar & {
          authMode: "client";
          lmsClientname: string;
          lmsClientsecret: string;
          lmsRestApiToken?: never;
      });

export type UpdateAssessmentToolPar = {
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
};
