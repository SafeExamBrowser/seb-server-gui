import {
    copyExamTemplate as copyExamTemplateSdk,
    createIndicatorTemplate as createIndicatorTemplateSdk,
    createTemporaryConfigTemplate as createTemporaryConfigTemplateSdk,
    deleteExamTemplate as deleteExamTemplateSdk,
    deleteIndicatorTemplate as deleteIndicatorTemplateSdk,
    editExamTemplate as editExamTemplateSdk,
    fullCreateExamTemplate as fullCreateExamTemplateSdk,
    getExamTemplateById as getExamTemplateByIdSdk,
    getExamTemplateNames as getExamTemplateNamesSdk,
    getExamTemplates as getExamTemplatesSdk,
    getExamTemplateScreenProctoringSettings as getExamTemplateScreenProctoringSettingsSdk,
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
    type ExamTemplateName,
    examTemplateNameSchema,
    type ExamTemplatePage,
    examTemplatePageSchema,
    examTemplateSchema,
    type ExamTemplateScreenProctoring,
    examTemplateScreenProctoringSchema,
    type ExamTemplateSelection,
    type ExamTemplateSelectionPage,
    examTemplateSelectionPageSchema,
    examTemplateSelectionSchema,
    type Indicator,
    type IndicatorExisting,
    indicatorExistingSchema,
    indicatorSchema,
} from "@/models/examTemplate.ts";
import { decodeWire, encodeWire } from "@/services/errors/wireCodec.ts";

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

// The selection views decode without indicator templates, so the exam creation
// flow keeps working for templates whose indicators the new GUI cannot edit.

export const getExamTemplateSelectionPage = (
    query?: GetExamTemplatesData["query"],
): Promise<ExamTemplateSelectionPage> =>
    getExamTemplatesSdk({ client, query }).then(({ data }) =>
        decodeWire(examTemplateSelectionPageSchema, data),
    );

export const getExamTemplateSelectionById = (
    modelId: string,
): Promise<ExamTemplateSelection> =>
    getExamTemplateByIdSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(examTemplateSelectionSchema, data),
    );

export const getExamTemplateNames = (): Promise<ExamTemplateName[]> =>
    getExamTemplateNamesSdk({ client }).then(({ data }) =>
        (data ?? []).map((name) => decodeWire(examTemplateNameSchema, name)),
    );

export const getExamTemplateScreenProctoringSettings = (
    modelId: number,
): Promise<ExamTemplateScreenProctoring> =>
    getExamTemplateScreenProctoringSettingsSdk({
        client,
        path: { modelId },
    }).then(({ data }) => decodeWire(examTemplateScreenProctoringSchema, data));
