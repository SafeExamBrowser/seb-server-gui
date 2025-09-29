type Threshold = {
    value: number;
    color: string;
    icon?: string;
};

type IndicatorTemplate = {
    id?: number;
    examTemplateId?: number;
    name: string;
    type: string;
    thresholds: Threshold[];
};

type ClientGroupTemplate = {
    id?: number;
    name: string;
    type: string;
    color?: string;
    icon?: string;
    ipRangeStart?: string;
    ipRangeEnd?: string;
    clientOS?: string;
    nameRangeStartLetter?: string;
    nameRangeEndLetter?: string;
};

type ExamAttribute = {
    enableScreenProctoring: string;
    SCREEN_PROCTORING_SETTINGS?: ScreenProctoringTemplate;
    quitPassword?: string;
};

type ScreenProctoringTemplate = {
    spsCollectingStrategy?: string;
    spsCollectingGroupName?: string;
    spsCollectingGroupSize?: number;
    spsSEBGroupsSelection?: string;
};

type ExamTemplate = {
    id?: number;
    name: string;
    description?: string;
    examType: string;
    supporter: string[];
    configurationTemplateId?: number;
    institutionalDefault: boolean;
    lmsIntegration: boolean;
    clientConfigurationId?: number;
    indicatorTemplates: IndicatorTemplate[];
    CLIENT_GROUP_TEMPLATES: ClientGroupTemplate[];
    EXAM_ATTRIBUTES: ExamAttribute;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExamTemplates = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ExamTemplate[];
};
