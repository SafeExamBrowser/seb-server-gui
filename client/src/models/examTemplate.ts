type ExamTemplates = {
    number_of_pages: number,
    page_number: number,
    page_size: number,
    content: ExamTemplate[]
}

type ExamTemplate = {
    id: number,
    institutionId: number,
    name: string,
    description: string,
    examType: string,
    supporter: string[],
    configurationTemplateId: number,
    institutionalDefault: boolean,
    lmsIntegration: boolean,
    clientConfigurationId: number,
    indicatorTemplates: IndicatorTemplate[]
    CLIENT_GROUP_TEMPLATES: ClientGroupTemplate[],
    EXAM_ATTRIBUTES: ExamAttribute[],
    complete: boolean
}

type IndicatorTemplate = {
    id: number,
    examTemplateId: number,
    name: string,
    type: string,
    thresholds: Threshold[]
}

type Threshold = {
    value: string,
    color: string
}

type ClientGroupTemplate = {
    id: number,
    name: string,
    type: string,
    clientOS: string,
    examTemplateId: number
}

type ExamAttribute = [
    enableScreenProctoring: string,
    SCREEN_PROCTORING_SETTINGS: string,
    quitPassword: string
]