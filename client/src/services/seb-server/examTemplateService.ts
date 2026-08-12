import { z } from "zod";

import {
    copyExamTemplate as copyExamTemplateSdk,
    createIndicatorTemplate as createIndicatorTemplateSdk,
    createTemporaryConfigTemplate as createTemporaryConfigTemplateSdk,
    deleteExamTemplate as deleteExamTemplateSdk,
    deleteIndicatorTemplate as deleteIndicatorTemplateSdk,
    editExamTemplate as editExamTemplateSdk,
    fullCreateExamTemplate as fullCreateExamTemplateSdk,
    getExamTemplateById as getExamTemplateByIdSdk,
    getExamTemplates as getExamTemplatesSdk,
    saveIndicatorTemplate as saveIndicatorTemplateSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import type {
    EntityProcessingReport,
    GetExamTemplatesData,
} from "@/api/seb-server/generated/hey-api/types.gen.ts";
import {
    zEntityProcessingReport,
    zIndicatorTemplate,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    type ConfigurationTemplateKey,
    configurationTemplateKeySchema,
    type ExamTemplate,
    type ExamTemplateCreate,
    examTemplateCreateSchema,
    type ExamTemplateListItem,
    examTemplateListItemSchema,
    type ExamTemplatePage,
    examTemplatePageSchema,
    examTemplateSchema,
    type Indicator,
    type IndicatorExisting,
    indicatorExistingSchema,
    indicatorSchema,
} from "@/models/examTemplate.ts";
import {
    clientGroupTemplatesSchema,
    ExamTemplate as LegacyExamTemplate,
    ExamTemplates as LegacyExamTemplates,
    indicatorTemplatesSchema,
} from "@/models/seb-server/examTemplate.ts";
import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring.ts";
import * as apiService from "@/services/apiService";
import { decodeWire, encodeWire } from "@/services/errors/wireCodec.ts";
import { BasicListParams } from "@/services/types";
import { normaliseBasicListParams } from "@/utils/table/tableUtils";

export const getExamTemplatePage = (
    query?: GetExamTemplatesData["query"],
): Promise<ExamTemplatePage> =>
    getExamTemplatesSdk({ client, query }).then(({ data }) =>
        decodeWire(examTemplatePageSchema, data),
    );

export const getExamTemplateById = (modelId: string): Promise<ExamTemplate> =>
    getExamTemplateByIdSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(examTemplateSchema, data),
    );

export const fullCreateExamTemplate = (
    body: ExamTemplateCreate,
): Promise<ExamTemplate> =>
    fullCreateExamTemplateSdk({
        client,
        body: encodeWire(examTemplateCreateSchema, body),
    }).then(({ data }) => decodeWire(examTemplateSchema, data));

export const editExamTemplate = (body: ExamTemplate): Promise<ExamTemplate> =>
    editExamTemplateSdk({
        client,
        body: encodeWire(examTemplateSchema, body),
    }).then(({ data }) => decodeWire(examTemplateSchema, data));

export const deleteExamTemplate = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deleteExamTemplateSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );

export const copyExamTemplate = (
    modelId: string,
): Promise<ExamTemplateListItem> =>
    copyExamTemplateSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(examTemplateListItemSchema, data),
    );

export const createTemporaryConfigTemplate =
    (): Promise<ConfigurationTemplateKey> =>
        createTemporaryConfigTemplateSdk({ client }).then(({ data }) =>
            decodeWire(configurationTemplateKeySchema, data),
        );

// The backend reads thresholds of this form-encoded endpoint as "value|color" strings
// (POSTMapper.getThresholds), which the generic form serializer cannot produce.
// TODO(backend): consider accepting the same JSON threshold shape as the PUT endpoint.
const serializeIndicatorTemplateForm = (body: unknown): string => {
    const indicatorTemplate = zIndicatorTemplate.parse(body);
    const params = new URLSearchParams();

    if (indicatorTemplate.examTemplateId !== undefined) {
        params.append(
            "examTemplateId",
            String(indicatorTemplate.examTemplateId),
        );
    }

    params.append("name", indicatorTemplate.name);
    params.append("type", indicatorTemplate.type);
    indicatorTemplate.thresholds.forEach((threshold) =>
        params.append(
            "thresholds",
            `${threshold.value}|${threshold.color ?? ""}`,
        ),
    );

    return params.toString();
};

export const createIndicatorTemplate = (
    examTemplateId: number,
    indicator: Indicator,
): Promise<IndicatorExisting> =>
    createIndicatorTemplateSdk({
        client,
        body: { ...encodeWire(indicatorSchema, indicator), examTemplateId },
        bodySerializer: serializeIndicatorTemplateForm,
    }).then(({ data }) => decodeWire(indicatorExistingSchema, data));

export const saveIndicatorTemplate = (
    examTemplateId: number,
    indicator: IndicatorExisting,
): Promise<IndicatorExisting> =>
    saveIndicatorTemplateSdk({
        client,
        body: {
            ...encodeWire(indicatorExistingSchema, indicator),
            examTemplateId,
        },
    }).then(({ data }) => decodeWire(indicatorExistingSchema, data));

export const deleteIndicatorTemplate = async (
    examTemplateId: number,
    indicatorId: number,
): Promise<void> => {
    await deleteIndicatorTemplateSdk({
        client,
        path: {
            parentModelId: String(examTemplateId),
            modelId: String(indicatorId),
        },
    });
};

// Everything below stays on the legacy apiService stack for the exam pages
// (exam detail, exam create wizard). It moves to the generated client when the
// Exam domain is migrated.

const baseUrl = "/exam-template" as const;

export const getExamTemplates = async ({
    basicListParams,
    name,
    examType,
}: {
    basicListParams?: BasicListParams;
    name?: string;
    examType?: string;
}): Promise<LegacyExamTemplates> =>
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

export const getExamTemplate = async (
    id: string,
): Promise<LegacyExamTemplate> => {
    const template: LegacyExamTemplate = (
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
