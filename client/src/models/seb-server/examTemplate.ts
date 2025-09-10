type Threshold = {
    value: number;
    color: string;
    icon: string;
};

type IndicatorTemplate = {
    id: number;
    examTemplateId: number;
    name: string;
    type: string;
    thresholds: Threshold[];
};

type ExamAttribute = {
    enableScreenProctoring: string;
    SCREEN_PROCTORING_SETTINGS: string;
    quitPassword: string;
};

type ExamTemplate = {
    id: number;
    institutionId: number;
    name: string;
    description: string;
    examType: string;
    supporter: string[];
    configurationTemplateId: number;
    institutionalDefault: boolean;
    lmsIntegration: boolean;
    clientConfigurationId: number;
    indicatorTemplates: IndicatorTemplate[];
    CLIENT_GROUP_TEMPLATES: ClientGroup[];
    EXAM_ATTRIBUTES: ExamAttribute;
    complete: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExamTemplates = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ExamTemplate[];
};
