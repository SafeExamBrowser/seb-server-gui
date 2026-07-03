import { APIMessage } from "@/services/errors/types";

export type CreateExamPar = {
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

export type CreateExamWithURLPar = {
    institutionId?: number;
    quizName: string;
    quiz_description: string;
    quizStartTime: number;
    quizEndTime: number;
    quiz_start_url: string;
    examTemplateId: number;
    type?: string;
    quitPassword?: string;
    supporter: string[];
    clientGroupIds: string;
};

export type ExamAdditionalAttributes = {
    SIGNATURE_KEY_SALT: string;
    ADDITIONAL_QUIZ_ATTRIBUTES: string;
    quiz_start_url: string;
    quiz_description: string;
    SCREEN_PROCTORING_SETTINGS: string;
    enableScreenProctoring: string;
    SIGNATURE_KEY_CHECK_ENABLED: string;
    NUMERICAL_TRUST_THRESHOLD: string;
};

export type Exam = {
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
    followupId: number;
    excludeFromDeletion: boolean;
};

export type BasicSettings = Pick<
    Exam,
    | "quizName"
    | "description"
    | "startURL"
    | "quizStartTime"
    | "quizEndTime"
    | "type"
    | "status"
>;

export type Exams = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: Exam[];
};

export type CreateExamResult = {
    examId: string;
    partialMessages?: APIMessage[];
};
