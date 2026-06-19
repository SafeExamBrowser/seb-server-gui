import { z } from "zod";
import * as apiService from "@/services/apiService";
import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring";
import {
    ExamTemplate,
    ExamTemplates,
    clientGroupTemplatesSchema,
    indicatorTemplatesSchema,
} from "@/models/seb-server/examTemplate";
import { ConfigurationTemplateKey } from "@/models/seb-server/configurationNode";
import { BasicListParams } from "@/services/types";
import { normaliseBasicListParams } from "@/utils/table/tableUtils";

const baseUrl = "/exam-template" as const;

export const getExamTemplates = async ({
    basicListParams,
    name,
    examType,
}: {
    basicListParams?: BasicListParams;
    name?: string;
    examType?: string;
}): Promise<ExamTemplates> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: {
                _authType: "seb",
                params: {
                    ...normaliseBasicListParams(basicListParams),
                    name,
                    examType,
                },
            },
        })
    ).data;

export const getExamTemplate = async (id: string): Promise<ExamTemplate> => {
    const template: ExamTemplate = (
        await apiService.getRequest({
            url: `${baseUrl}/${id}`,
            options: { _authType: "seb" },
        })
    ).data;

    return {
        ...template,
        indicatorTemplates: z.decode(
            indicatorTemplatesSchema,
            template.indicatorTemplates,
        ),
        CLIENT_GROUP_TEMPLATES: z.decode(
            clientGroupTemplatesSchema,
            template.CLIENT_GROUP_TEMPLATES,
        ),
    };
};

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
            data: {
                ...examTemplate,
                indicatorTemplates: z.encode(
                    indicatorTemplatesSchema,
                    examTemplate.indicatorTemplates,
                ),
            },
            options: {
                _authType: "seb",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        })
    ).data;

export const updateExamTemplate = async (
    examTemplate: ExamTemplate,
): Promise<ExamTemplate> => {
    const updated: ExamTemplate = (
        await apiService.putRequest({
            url: baseUrl,
            data: {
                ...examTemplate,
                indicatorTemplates: z.encode(
                    indicatorTemplatesSchema,
                    examTemplate.indicatorTemplates,
                ),
            },
            options: {
                _authType: "seb",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        })
    ).data;

    return {
        ...updated,
        indicatorTemplates: z.decode(
            indicatorTemplatesSchema,
            updated.indicatorTemplates,
        ),
        CLIENT_GROUP_TEMPLATES: z.decode(
            clientGroupTemplatesSchema,
            updated.CLIENT_GROUP_TEMPLATES,
        ),
    };
};

export const createTemporaryConfigurationTemplate =
    async (): Promise<ConfigurationTemplateKey> =>
        (
            await apiService.postRequest({
                url: `${baseUrl}/create-config-template`,
                options: {
                    _authType: "seb",
                    params: {},
                },
            })
        ).data;
