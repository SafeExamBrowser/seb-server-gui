import * as apiService from "./sp-api.service";

const screenshotDataUrl: string = "/proctoring/screenshot-data/";
const screenshotTimestampsUrl: string = "/proctoring/screenshot-timestamps/";

export async function getScreenshotDataBySessionId(token: string, sessionId: string): Promise<[object, number]>{
    const url: string = screenshotDataUrl + sessionId;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function getScreenshotDataByTimestamp(token: string, sessionId: string, timestamp: string): Promise<[object, number]>{
    const url: string =  screenshotDataUrl + sessionId + "/" + timestamp;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function getScreenshotTimestamps(token: string, sessionId: string, timestamp: string, direction: string): Promise<[object, number]>{
    const url: string =  screenshotTimestampsUrl + sessionId + "/" + timestamp + "/" + direction;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}