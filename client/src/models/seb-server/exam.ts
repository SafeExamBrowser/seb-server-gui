type CreateExamPar = {
    institutionId?: number;
    lmsSetupId: number;
    lms_setup_id: number;
    externalId: string;
    quiz_id: string;
    examTemplateId: number;
    type?: string;
    quitPassword?: string;
    supporter: string[];
    clientGroupIds: string;
};

type UpdateExamPar = {
    institutionId: number;
    lmsSetupId?: number;
    lms_setup_id?: number;
    externalId: string;
    quiz_id?: string;
    examTemplateId?: number;
    type: string;
    quitPassword?: string;
    supporter?: string[];
    id: number;
    quizStartTime: string;
    quizEndTime: string;
    quizName: string;
    quiz_start_url: string;
};

type Exams = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: Exam[];
};

type Exam = {
    id: number;
    institutionId: number;
    lmsSetupId: number;
    externalId: string;
    lmsAvailable: boolean;
    quizName: string;
    quizStartTime: string;
    quizEndTime: string;
    type: string;
    owner: string;
    supporter: string[];
    status: string;
    lmsSebRestriction: boolean;
    active: boolean;
    examTemplateId: number;
    lastModified: number;
    additionalAttributes: ExamAdditionalAttributes;
    description: string;
    startURL: string;
    quitPassword: string;
};

type ExamAdditionalAttributes = {
    SIGNATURE_KEY_SALT: string;
    ADDITIONAL_QUIZ_ATTRIBUTES: string;
    quiz_start_url: string;
    quiz_description: string;
    SCREEN_PROCTORING_SETTINGS: string;
    enableScreenProctoring: string;
    SIGNATURE_KEY_CHECK_ENABLED: string;
    NUMERICAL_TRUST_THRESHOLD: string;
};
