import { ScreenshotData } from "@/models/screen-proctoring/session";
import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";
import * as apiService from "@/services/apiService";

const baseUrl = "/sps/proctoring/screenshot-data" as const;

export const getScreenshotDataBySessionId = async (
    sessionId: string,
): Promise<ScreenshotData> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${sessionId}`,
            options: { _authType: "sps" },
        })
    ).data;

export const getScreenshotDataByTimestamp = async (
    sessionId: string,
    timestamp: string,
): Promise<ScreenshotData> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${sessionId}/${timestamp}`,
            options: { _authType: "sps" },
        })
    ).data;

export const getScreenshotTimestamps = async (
    sessionId: string,
    timestamp: string,
    direction: SortOrder,
) =>
    (
        await apiService.getRequest({
            url: `/sps/proctoring/screenshot-timestamps/${sessionId}/${timestamp}/${direction}`,
            options: { _authType: "sps" },
        })
    ).data;
