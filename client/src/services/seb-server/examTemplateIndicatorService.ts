import { z } from "zod";
import * as apiService from "@/services/apiService";
import {
    colorCodec,
    indicatorExistingSchema,
    thresholdSchema,
    type Indicator,
    type IndicatorExisting,
} from "@/models/seb-server/examTemplate.ts";

const baseUrl = "/exam-template" as const;

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
                    `${threshold.value}|${colorCodec.encode(threshold.color)}`,
            ),
        },
        options: { _authType: "seb" },
    });

    return indicatorExistingSchema.parse(response.data);
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
            thresholds: z.encode(
                z.array(thresholdSchema),
                indicator.thresholds,
            ),
        },
        options: { _authType: "seb" },
    });

    return indicatorExistingSchema.parse(response.data);
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
