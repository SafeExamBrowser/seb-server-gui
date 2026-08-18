import { z } from "zod";

import {
    zConfigurationNode,
    zEntityName,
    zExamTemplate,
    zIndicatorTemplate,
    zPageExamTemplate,
    zScreenProctoringSettings,
    zThreshold,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum.ts";
import { clientGroupExistingSchema } from "@/models/seb-server/examTemplate.ts";
import { IndicatorEnum } from "@/models/seb-server/monitoringEnums.ts";

const requiredInt = (schema: typeof zExamTemplate.shape.id, message: string) =>
    z.codec(schema, z.int(), {
        decode: (value) => {
            if (value === undefined) {
                throw new Error(message);
            }
            return value;
        },
        encode: (value) => value,
    });

const thresholdColorCodec = z.codec(zThreshold.shape.color, z.string(), {
    decode: (color) => {
        if (color === undefined) {
            throw new Error("Indicator threshold is missing its color");
        }
        return color.startsWith("#") ? color : `#${color}`;
    },
    encode: (color) => (color.startsWith("#") ? color.slice(1) : color),
});

export const thresholdSchema = zThreshold.pick({ value: true }).extend({
    color: thresholdColorCodec,
});

export type Threshold = z.infer<typeof thresholdSchema>;

const supportedIndicatorTypeCodec = z.codec(
    zIndicatorTemplate.shape.type,
    z.enum([IndicatorEnum.BATTERY_STATUS, IndicatorEnum.WLAN_STATUS]),
    {
        decode: (type) => {
            if (type === "BATTERY_STATUS") {
                return IndicatorEnum.BATTERY_STATUS;
            }
            if (type === "WLAN_STATUS") {
                return IndicatorEnum.WLAN_STATUS;
            }
            throw new Error(`Unsupported indicator template type: ${type}`);
        },
        encode: (type) =>
            type === IndicatorEnum.BATTERY_STATUS
                ? "BATTERY_STATUS"
                : "WLAN_STATUS",
    },
);

export const indicatorSchema = zIndicatorTemplate.pick({ name: true }).extend({
    type: supportedIndicatorTypeCodec,
    thresholds: z.array(thresholdSchema),
});

export type Indicator = z.infer<typeof indicatorSchema>;

export const indicatorExistingSchema = indicatorSchema.extend({
    id: requiredInt(
        zIndicatorTemplate.shape.id,
        "Indicator template response is missing its id",
    ),
});

export type IndicatorExisting = z.infer<typeof indicatorExistingSchema>;

const clientGroupTemplatesCodec = z.codec(
    zExamTemplate.shape.CLIENT_GROUP_TEMPLATES,
    z.array(clientGroupExistingSchema),
    {
        decode: (groups) =>
            groups.map((group) => clientGroupExistingSchema.parse(group)),
        encode: (groups) => groups,
    },
);

const examAttributesAppSchema = z.object({
    enableScreenProctoring: z.string().optional(),
    spsCollectingStrategy: z.string().optional(),
    spsCollectingGroupName: z.string().optional(),
    spsCollectingGroupSize: z.string().optional(),
    spsSEBGroupsSelection: z.string().optional(),
    quitPassword: z.string().optional(),
});

const examAttributesCodec = z.codec(
    zExamTemplate.shape.EXAM_ATTRIBUTES,
    examAttributesAppSchema,
    {
        decode: (attributes) => attributes,
        encode: (attributes) =>
            Object.fromEntries(
                Object.entries(attributes).filter(
                    (entry): entry is [string, string] =>
                        entry[1] !== undefined,
                ),
            ),
    },
);

export type ExamAttribute = z.infer<typeof examAttributesCodec>;

const supporterCodec = z.codec(
    zExamTemplate.shape.supporter,
    z.array(z.string()),
    {
        decode: (supporter) => supporter ?? [],
        encode: (supporter) => supporter,
    },
);

type WireExamType = NonNullable<z.infer<typeof zExamTemplate.shape.examType>>;

const EXAM_TYPE_FROM_WIRE: Record<WireExamType, ExamTypeEnum> = {
    UNDEFINED: ExamTypeEnum.UNDEFINED,
    MANAGED: ExamTypeEnum.MANAGED,
    BYOD: ExamTypeEnum.BYOD,
    VDI: ExamTypeEnum.VDI,
};

const EXAM_TYPE_TO_WIRE: Record<ExamTypeEnum, WireExamType> = {
    [ExamTypeEnum.UNDEFINED]: "UNDEFINED",
    [ExamTypeEnum.MANAGED]: "MANAGED",
    [ExamTypeEnum.BYOD]: "BYOD",
    [ExamTypeEnum.VDI]: "VDI",
};

const examTypeCodec = z.codec(
    zExamTemplate.shape.examType,
    z.enum(ExamTypeEnum).optional(),
    {
        decode: (examType) =>
            examType === undefined ? undefined : EXAM_TYPE_FROM_WIRE[examType],
        encode: (examType) =>
            examType === undefined ? undefined : EXAM_TYPE_TO_WIRE[examType],
    },
);

export const examTemplateSchema = zExamTemplate
    .pick({
        name: true,
        description: true,
        configurationTemplateId: true,
        institutionalDefault: true,
        lmsIntegration: true,
        clientConfigurationId: true,
    })
    .extend({
        id: requiredInt(
            zExamTemplate.shape.id,
            "Exam template response is missing its id",
        ),
        institutionId: requiredInt(
            zExamTemplate.shape.institutionId,
            "Exam template response is missing its institution id",
        ),
        examType: examTypeCodec,
        supporter: supporterCodec,
        indicatorTemplates: z.array(indicatorExistingSchema),
        CLIENT_GROUP_TEMPLATES: clientGroupTemplatesCodec,
        EXAM_ATTRIBUTES: examAttributesCodec,
    });

export type ExamTemplate = z.infer<typeof examTemplateSchema>;

export type BasicSettings = Pick<
    ExamTemplate,
    | "name"
    | "description"
    | "examType"
    | "clientConfigurationId"
    | "configurationTemplateId"
    | "lmsIntegration"
    | "institutionalDefault"
> & {
    screenProctoringEnabled: boolean;
};

export const examTemplateCreateSchema = zExamTemplate
    .pick({
        name: true,
        description: true,
        configurationTemplateId: true,
        institutionalDefault: true,
        lmsIntegration: true,
    })
    .extend({
        clientConfigurationId: z.int().positive(),
        examType: examTypeCodec,
        supporter: z.array(z.string()),
        indicatorTemplates: z.array(indicatorExistingSchema),
        CLIENT_GROUP_TEMPLATES: clientGroupTemplatesCodec,
        EXAM_ATTRIBUTES: examAttributesCodec,
    });

export type ExamTemplateCreate = z.infer<typeof examTemplateCreateSchema>;

export const examTemplateListItemSchema = zExamTemplate
    .pick({
        name: true,
        description: true,
        configurationTemplateId: true,
        institutionalDefault: true,
        lmsIntegration: true,
        clientConfigurationId: true,
    })
    .extend({
        id: requiredInt(
            zExamTemplate.shape.id,
            "Exam template response is missing its id",
        ),
        examType: examTypeCodec,
    });

export type ExamTemplateListItem = z.infer<typeof examTemplateListItemSchema>;

export const examTemplatePageSchema = zPageExamTemplate
    .pick({
        number_of_pages: true,
        page_number: true,
        page_size: true,
        sort: true,
    })
    .extend({
        content: z.array(examTemplateListItemSchema).optional(),
    });

export type ExamTemplatePage = z.infer<typeof examTemplatePageSchema>;

export const examTemplateSelectionSchema = examTemplateListItemSchema.extend({
    supporter: supporterCodec,
    CLIENT_GROUP_TEMPLATES: clientGroupTemplatesCodec,
    EXAM_ATTRIBUTES: examAttributesCodec,
});

export type ExamTemplateSelection = z.infer<typeof examTemplateSelectionSchema>;

export const examTemplateSelectionPageSchema = zPageExamTemplate
    .pick({
        number_of_pages: true,
        page_number: true,
        page_size: true,
        sort: true,
    })
    .extend({
        content: z.array(examTemplateSelectionSchema).optional(),
    });

export type ExamTemplateSelectionPage = z.infer<
    typeof examTemplateSelectionPageSchema
>;

export const examTemplateNameSchema = zEntityName.pick({
    modelId: true,
    name: true,
});

export type ExamTemplateName = z.infer<typeof examTemplateNameSchema>;

export const examTemplateScreenProctoringSchema =
    zScreenProctoringSettings.pick({ spsSEBGroupsSelection: true });

export type ExamTemplateScreenProctoring = z.infer<
    typeof examTemplateScreenProctoringSchema
>;

export const configurationTemplateKeySchema = zConfigurationNode
    .pick({ name: true })
    .extend({
        id: requiredInt(
            zConfigurationNode.shape.id,
            "Configuration template response is missing its id",
        ),
    });

export type ConfigurationTemplateKey = z.infer<
    typeof configurationTemplateKeySchema
>;
