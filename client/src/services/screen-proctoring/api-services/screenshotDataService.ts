import * as newApiService from "@/services/newApiService";
import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";
import { ScreenshotData } from "@/models/screen-proctoring/session";

const baseUrl = "/proctoring/screenshot-data" as const;

export const getScreenshotDataBySessionId = async (
    sessionId: string,
): Promise<ScreenshotData> =>
    (await newApiService.getRequest(`${baseUrl}/${sessionId}`)).data;

export const getScreenshotDataByTimestamp = async (
    sessionId: string,
    timestamp: string,
): Promise<ScreenshotData> =>
    (await newApiService.getRequest(`${baseUrl}/${sessionId}/${timestamp}`))
        .data;

export const getScreenshotTimestamps = async (
    sessionId: string,
    timestamp: string,
    direction: SortOrder,
) =>
    (
        await newApiService.getRequest(
            `/proctoring/screenshot-timestamps/${sessionId}/${timestamp}/${direction}`,
        )
    ).data;
