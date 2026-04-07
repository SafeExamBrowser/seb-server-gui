import * as apiService from "@/services/apiService";
import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring";
import { ExamTemplate, ExamTemplates } from "@/models/seb-server/examTemplate";

const baseUrl = "/exam-template" as const;

export const getExamTemplates = async (): Promise<ExamTemplates> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: { _authType: "seb" },
        })
    ).data;

export const getExamTemplate = async (id: string): Promise<ExamTemplate> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${id}`,
            options: { _authType: "seb" },
        })
    ).data;

export const deleteExamTemplate = async (id: number): Promise<void> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}/${id}`,
            options: { _authType: "seb" },
        })
    ).data;

export const copyExamTemplate = async (id: number): Promise<void> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${id}/copy`,
            options: { _authType: "seb" },
        })
    ).data;

export const getExamTemplateNames = async (): Promise<
    {
        modelId: string;
        entityType: "EXAM_TEMPLATE";
        name: string;
    }[]
> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/names`,
            options: { _authType: "seb" },
        })
    ).data;

export const getExamTemplateSp = async (
    id: string,
): Promise<ScreenProctoringSettings> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${id}/screen-proctoring`,
            options: { _authType: "seb" },
        })
    ).data;

export const createExamTemplate = async (
    examTemplate: ExamTemplate,
): Promise<ExamTemplate> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/create`,
            data: examTemplate,
            options: {
                _authType: "seb",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        })
    ).data;
