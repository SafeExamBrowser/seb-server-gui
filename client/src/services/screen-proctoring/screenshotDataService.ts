import * as apiService from "@/services/apiService";
import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";
import { ScreenshotData } from "@/models/screen-proctoring/session";

const baseUrl = "/proctoring/screenshot-data" as const;

export const getScreenshotDataBySessionId = async (
    sessionId: string,
): Promise<ScreenshotData> =>
    (await apiService.getRequest(`${baseUrl}/${sessionId}`, undefined, "sps"))
        .data;

export const getScreenshotDataByTimestamp = async (
    sessionId: string,
    timestamp: string,
): Promise<ScreenshotData> =>
    (
        await apiService.getRequest(
            `${baseUrl}/${sessionId}/${timestamp}`,
            undefined,
            "sps",
        )
    ).data;

export const getScreenshotTimestamps = async (
    sessionId: string,
    timestamp: string,
    direction: SortOrder,
) =>
    (
        await apiService.getRequest(
            `/proctoring/screenshot-timestamps/${sessionId}/${timestamp}/${direction}`,
            undefined,
            "sps",
        )
    ).data;
