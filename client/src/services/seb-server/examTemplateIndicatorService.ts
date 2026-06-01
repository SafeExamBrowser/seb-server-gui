import * as apiService from "@/services/apiService";
import {
    indicatorExistingSchema,
    type Indicator,
    type IndicatorExisting,
} from "@/models/seb-server/examTemplate.ts";

const baseUrl = "/exam-template" as const;

// TODO @alain: drop the hash prefix entirely so we don't have to translate color, then these two helpers can be removed.
// Both helpers are idempotent because the API is inconsistent: some colors come back with a "#" prefix, some without.
const addHash = (color: string) =>
    color.startsWith("#") ? color : `#${color}`;
const stripHash = (color: string) =>
    color.startsWith("#") ? color.slice(1) : color;

export const apiIndicatorSchema = indicatorExistingSchema.transform((api) => ({
    ...api,
    thresholds: api.thresholds.map((threshold) => ({
        value: threshold.value,
        color: addHash(threshold.color),
    })),
}));

export const createIndicator = async (
    examTemplateId: number,
    indicator: Indicator,
): Promise<IndicatorExisting> => {
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
    indicator: IndicatorExisting,
): Promise<IndicatorExisting> => {
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
): Promise<void> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}/${examTemplateId}/indicator/${indicatorId}`,
            options: { _authType: "seb" },
        })
    ).data;
