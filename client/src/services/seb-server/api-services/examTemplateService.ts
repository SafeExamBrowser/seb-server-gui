import * as apiService from "@/services/apiService";

import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring";
import { ExamTemplate, ExamTemplates } from "@/models/seb-server/examTemplate";

const baseUrl = "/exam-template" as const;

export const getExamTemplates = async (): Promise<ExamTemplates> =>
    (await apiService.getRequest(baseUrl)).data;

export const getExamTemplate = async (id: string): Promise<ExamTemplate> =>
    (await apiService.getRequest(`${baseUrl}/${id}`)).data;

export const getExamTemplateNames = async (): Promise<
    {
        modelId: string;
        entityType: "EXAM_TEMPLATE";
        name: string;
    }[]
> => (await apiService.getRequest(`${baseUrl}/names`)).data;

export const getExamTemplateSp = async (
    id: string,
): Promise<ScreenProctoringSettings> =>
    (await apiService.getRequest(`${baseUrl}/${id}/screen-proctoring`)).data;

export const createExamTemplate = async (
    examTemplate: ExamTemplate,
): Promise<ExamTemplate> =>
    (await apiService.postRequest(`${baseUrl}/create`, examTemplate)).data;
