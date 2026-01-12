import * as newApiService from "@/services/newApiService";

import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring";
import { ExamTemplate, ExamTemplates } from "@/models/seb-server/examTemplate";

const url: string = "/exam-template";

export const getExamTemplate = async (id: string): Promise<ExamTemplate> =>
    (await newApiService.get(url + "/" + id)).data;

export const getExamTemplateNames = async (): Promise<
    {
        modelId: string;
        entityType: "EXAM_TEMPLATE";
        name: string;
    }[]
> => (await newApiService.get(`${url}/names`)).data;

export const getExamTemplates = async (): Promise<ExamTemplates> =>
    (await newApiService.get(url)).data;

export const getExamTemplateSp = async (
    id: string,
): Promise<ScreenProctoringSettings> =>
    (await newApiService.get(url + "/" + id + "/screen-proctoring")).data;

export const createExamTemplate = async (
    examTemplate: ExamTemplate,
): Promise<ExamTemplate> =>
    (await newApiService.post(url + "/create", examTemplate)).data;
