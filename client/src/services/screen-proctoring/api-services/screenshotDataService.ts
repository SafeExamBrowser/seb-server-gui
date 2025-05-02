import axios, { AxiosResponse } from 'axios'
import * as apiService from "@/services/apiService";
import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";

export async function getScreenshotDataBySessionId(sessionId: string): Promise<ScreenshotData | any> {
    const url: string = "/sp/screenshot-data/" + sessionId;
    return (await apiService.api.get(url, { headers: apiService.getHeaders("spAccessToken") })).data;
}

export async function getScreenshotDataByTimestamp(sessionId: string, timestamp: string): Promise<ScreenshotData | any> {
    const url: string = "/sp/screenshot-data/" + sessionId + "/" + timestamp;
    return (await apiService.api.get(url, { headers: apiService.getHeaders("spAccessToken") })).data;
}

export async function getScreenshotTimestamps(sessionId: string, timestamp: string, direction: SortOrder) {
    const url: string = "/sp/screenshot-timestamps/" + sessionId + "/" + timestamp + "/" + direction;
    return (await apiService.api.get(url, { headers: apiService.getHeaders("spAccessToken") })).data;
}