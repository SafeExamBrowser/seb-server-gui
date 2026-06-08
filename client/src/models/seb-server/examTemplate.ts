import { z } from "zod";
import { IndicatorEnum } from "@/models/seb-server/monitoringEnums.ts";
import {
    ClientGroupEnum,
    clientOSLimitedValues,
} from "@/models/seb-server/clientGroupEnum.ts";

// RGB hash translation:
// - the API delivers/expects colors without a "#", the app works with a "#"
// - decode adds the hash (API -> app), encode strips it (app -> API)
export const colorCodec = z.codec(z.string(), z.string(), {
    decode: (api) => (api.startsWith("#") ? api : `#${api}`),
    encode: (app) => (app.startsWith("#") ? app.slice(1) : app),
});

export const thresholdSchema = z.object({
    value: z.number(), // the value of the threshold, range from 0 to 100 (%) for Battery and WiFi
    color: colorCodec, // the hex color value with the "#"
});

export type Threshold = z.infer<typeof thresholdSchema>;

export const indicatorSchema = z.object({
    name: z.string(),
    type: z.enum([IndicatorEnum.BATTERY_STATUS, IndicatorEnum.WLAN_STATUS]),
    thresholds: z.array(thresholdSchema),
});

export type Indicator = z.infer<typeof indicatorSchema>;

export const indicatorExistingSchema = indicatorSchema.extend({
    id: z.number(),
});

export type IndicatorExisting = z.infer<typeof indicatorExistingSchema>;

export const indicatorTemplatesSchema = z.array(indicatorExistingSchema);

const clientGroupBaseShape = {
    name: z.string(), // rules: min 3 - max 255 chars, unique within an exam template
    screenProctoringEnabled: z.boolean(),
};

const ipV4RangeShape = {
    type: z.literal(ClientGroupEnum.IP_V4_RANGE),
    ipRangeStart: z.string(), // rules: IP address
    ipRangeEnd: z.string(), // rules: IP address
};

const clientOSShape = {
    type: z.literal(ClientGroupEnum.CLIENT_OS),
    clientOS: z.enum(clientOSLimitedValues),
};

const nameRangeShape = {
    type: z.literal(ClientGroupEnum.NAME_ALPHABETICAL_RANGE),
    nameRangeStartLetter: z.string(), // rules: first letter must be before nameRangeEndLetter
    nameRangeEndLetter: z.string(), // rules: first letter must be after nameRangeStartLetter
};

const ipV4RangeGroupSchema = z.object({
    ...clientGroupBaseShape,
    ...ipV4RangeShape,
});
const clientOSGroupSchema = z.object({
    ...clientGroupBaseShape,
    ...clientOSShape,
});
const nameRangeGroupSchema = z.object({
    ...clientGroupBaseShape,
    ...nameRangeShape,
});

export const clientGroupSchema = z.discriminatedUnion("type", [
    ipV4RangeGroupSchema,
    clientOSGroupSchema,
    nameRangeGroupSchema,
]);

export type ClientGroup = z.infer<typeof clientGroupSchema>;

export const clientGroupExistingSchema = z.discriminatedUnion("type", [
    ipV4RangeGroupSchema.extend({ id: z.number() }),
    clientOSGroupSchema.extend({ id: z.number() }),
    nameRangeGroupSchema.extend({ id: z.number() }),
]);

export type ClientGroupExisting = z.infer<typeof clientGroupExistingSchema>;

export const clientGroupTemplatesSchema = z.array(clientGroupExistingSchema);

export type ExamAttribute = {
    enableScreenProctoring: string; // mandatory, screen proctoring enabled flag
    spsCollectingStrategy?: string; // mandatory, name of collecting strategy selection: "CollectingStrategyEnum" --> EXAM|APPLY_SEB_GROUPS
    spsCollectingGroupName?: string; // mandatory, min 3 - max 255 chars, name of the collecting of fallback room
    spsCollectingGroupSize?: string; // not used yet, must be null or absent
    spsSEBGroupsSelection?: string; // optional, comma separated list of selected ClientGroupTemplate list indices that are used for screen proctoring. (1)
    quitPassword?: string; // optional, is not used yet, ignore it
};

export type ExamTemplate = {
    id?: number; // PK of the ExamTemplate only available when the ExamTemplate exists
    name: string; // mandatory, min 3 - max 255 chars, name is unique for all ExamTemplate (2)
    description?: string; // optional, max 4000 chars, description text
    examType?: string; // optional exam type selection "ExamTypeEnum"
    supporter: string[]; // optional selection of Exam Supporter users (see Exam Wizard on how to fetch the possible users for selection)
    configurationTemplateId?: number; // mandatory, identifier of the the selected configuration template.  (3)
    institutionalDefault: boolean; // mandatory, institutional default flag
    lmsIntegration: boolean; // mandatory, Assessment Tool Integration flag
    clientConfigurationId?: number; // (optional or mandatory?) identifier of the the selected connection configuration. (4)
    indicatorTemplates: IndicatorExisting[];
    CLIENT_GROUP_TEMPLATES: ClientGroupExisting[]; //optional list of created ClientGroups
    EXAM_ATTRIBUTES: ExamAttribute; // additional exam attributes see ExamAttribute
};

export type ExamTemplates = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ExamTemplate[];
};

// (1)  spsSEBGroupsSelection: In the Wizard within the Screen Proctoring selection there is the type selection. This only is needed when the type selection is "APPLY_SEB_GROUPS"
//      In this case the Wizard should show existing ClientGroupTemplates in a list for selection. The system should then store the indices of the selected ClientGroupTemplates from
// 	    the original ClientGroupTemplates list as a comma separated sting into "spsSEBGroupsSelection"

// (2)  The uniqueness of the name of an ExamTemplate can be checked by fetching all existing ExamTemplate names with:
//      "GET: .../admin-api/v1/exam-template/names" to get a list of entity key pair like:
// 	[
// 		{
// 			"modelId": "1",
// 			"entityType": "EXAM_TEMPLATE",
// 			"name": "Exam Template 1"
// 		}
// 	]
//  Use the names of all fetched entries to check uniqueness (reduce it to a set of names where you can check, for example)

// (3) configurationTemplateId: This is the id of the selected configuration template. To get a list of all ConfigurationTemplates for selection use API call
//     "GET .../admin-api/v1/configuration-node/names?type=TEMPLATE&active=true" to get a list of entity key pair like:
// 	[
// 		{
// 			"modelId": "4",
// 			"entityType": "CONFIGURATION_NODE",
// 			"name": "Config Template 1"
// 		}
// 	]
// 	Use modelId and name for selection and use modelId as id of selected configurationTemplateId

// (4) clientConfigurationId:  This is the id of the selected client configuration. To get a list of all client configurations for selection use API call
//     "GET .../admin-api/v1/client_configuration/names?active=true" to get a list of entity key pair like:
// 	[
// 	  {
// 		"modelId": "1",
// 		"entityType": "SEB_CLIENT_CONFIGURATION",
// 		"name": "test"
// 	  }
// 	]
// 	Use modelId and name for selection and use modelId as id of selected configurationTemplateId
