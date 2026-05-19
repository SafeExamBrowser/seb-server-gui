import * as apiService from "@/services/apiService";
import { getExamTemplate } from "@/services/seb-server/examTemplateService";
import {
    indicatorSchema,
    type Indicator,
} from "@/components/widgets/indicatorsTable/types";

const baseUrl = "/exam-template" as const;

// TODO @alain: drop the hash prefix entirely so we don't have to translate color (API uses no hash prefix), then these two helpers can be removed.
const addHash = (color: string) => `#${color}`;
const stripHash = (color: string) =>
    color.startsWith("#") ? color.slice(1) : color;

const apiIndicatorSchema = indicatorSchema.transform((api) => ({
    ...api,
    thresholds: api.thresholds.map((threshold) => ({
        value: threshold.value,
        color: addHash(threshold.color),
    })),
}));

export const getIndicators = async (
    examTemplateId: number,
): Promise<Indicator[]> => {
    const template = await getExamTemplate(String(examTemplateId));

    return template.indicatorTemplates.map((api) =>
        apiIndicatorSchema.parse(api),
    );
};

export const createIndicator = async (
    examTemplateId: number,
    indicator: Indicator,
): Promise<Indicator> => {
    const response = await apiService.postRequest({
        url: `${baseUrl}/indicator`,
        data: {
            examTemplateId,
            name: indicator.name,
            type: indicator.type,
            // For this API (unlike for other indicator APIs), the backend expects thresholds as "value|color" strings
            // TODO @andreas: consider streamlining the API to use the same format as other indicator APIs.
            "thresholds[]": indicator.thresholds.map(
                (threshold) =>
                    `${threshold.value}|${stripHash(threshold.color)}`,
            ),
        },
        options: { _authType: "seb" },
    });

    return apiIndicatorSchema.parse(response.data);
};

export const updateIndicator = async (
    examTemplateId: number,
    indicator: Indicator,
): Promise<Indicator> => {
    const response = await apiService.putRequest({
        url: `${baseUrl}/indicator`,
        data: {
            id: indicator.id,
            examTemplateId,
            name: indicator.name,
            type: indicator.type,
            thresholds: indicator.thresholds.map((threshold) => ({
                value: threshold.value,
                color: stripHash(threshold.color),
            })),
        },
        options: { _authType: "seb" },
    });

    return apiIndicatorSchema.parse(response.data);
};

export const deleteIndicator = async (
    examTemplateId: number,
    indicatorId: number,
): Promise<void> => {
    await apiService.deleteRequest({
        url: `${baseUrl}/${examTemplateId}/indicator/${indicatorId}`,
        options: { _authType: "seb" },
    });
};
