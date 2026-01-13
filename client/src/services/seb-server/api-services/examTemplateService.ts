import * as newApiService from "@/services/newApiService";

import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring";
import { ExamTemplate, ExamTemplates } from "@/models/seb-server/examTemplate";

const baseUrl = "/exam-template" as const;

export const getExamTemplates = async (): Promise<ExamTemplates> =>
    (await newApiService.get(baseUrl)).data;

export const getExamTemplate = async (id: string): Promise<ExamTemplate> =>
    (await newApiService.get(`${baseUrl}/${id}`)).data;

export const getExamTemplateNames = async (): Promise<
    {
        modelId: string;
        entityType: "EXAM_TEMPLATE";
        name: string;
    }[]
> => (await newApiService.get(`${baseUrl}/names`)).data;

export const getExamTemplateSp = async (
    id: string,
): Promise<ScreenProctoringSettings> =>
    (await newApiService.get(`${baseUrl}/${id}/screen-proctoring`)).data;

export const createExamTemplate = async (
    examTemplate: ExamTemplate,
): Promise<ExamTemplate> =>
    (await newApiService.post(`${baseUrl}/create`, examTemplate)).data;
