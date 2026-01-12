import * as apiService from "@/services/apiService";
import * as newApiService from "@/services/newApiService";

import { StorageItemEnum } from "@/models/StorageItemEnum";
import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring";
import { ExamTemplate, ExamTemplates } from "@/models/seb-server/examTemplate";

const url: string = "/exam-template";

export async function getExamTemplate(id: string): Promise<ExamTemplate> {
    return (
        await apiService.api.get(url + "/" + id, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export const getExamTemplateNames = async (): Promise<
    {
        modelId: string;
        entityType: "EXAM_TEMPLATE";
        name: string;
    }[]
> => (await newApiService.get(`${url}/names`)).data;

export const getExamTemplates = async (): Promise<ExamTemplates> =>
    (await newApiService.get(url)).data;

export async function getExamTemplateSp(
    id: string,
): Promise<ScreenProctoringSettings> {
    return (
        await apiService.api.get(url + "/" + id + "/screen-proctoring", {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function createExamTemplate(
    examTemplate: ExamTemplate,
): Promise<ExamTemplate> {
    return (
        await apiService.api.post(url + "/create", examTemplate, {
            headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}
