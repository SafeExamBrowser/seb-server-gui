import * as apiService from "@/services/apiService";
import { IndicatorTemplate } from "@/models/seb-server/examTemplate";

const baseUrl = "/exam-template" as const;

export const createIndicatorTemplate = async (
    indicator: IndicatorTemplate,
): Promise<IndicatorTemplate> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/indicator`,
            data: {
                examTemplateId: indicator.examTemplateId,
                name: indicator.name,
                type: indicator.type,
                // For this API (unlike for other indicator APIs), the backend expects thresholds as "value|color" strings
                // TODO @andreas: consider streamlining the API to use the same format as other indicator APIs.
                "thresholds[]": indicator.thresholds.map(
                    (threshold) => `${threshold.value}|${threshold.color}`,
                ),
            },
            options: { _authType: "seb" },
        })
    ).data;

export const updateIndicatorTemplate = async (
    indicator: IndicatorTemplate,
): Promise<IndicatorTemplate> =>
    (
        await apiService.putRequest({
            url: `${baseUrl}/indicator`,
            data: indicator,
            options: { _authType: "seb" },
        })
    ).data;

export const deleteIndicatorTemplate = async (
    examTemplateId: number,
    indicatorId: number,
): Promise<void> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}/${examTemplateId}/indicator/${indicatorId}`,
            options: { _authType: "seb" },
        })
    ).data;
