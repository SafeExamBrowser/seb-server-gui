import * as apiService from "./sp-api.service";

const screenshotTimestampsUrl: string = "/proctoring/screenshot-timestamps/";

export async function getScreenshotTimestamps(token: string, sessionId: string, timestamp: string, direction: string): Promise<[object, number]>{
    const url: string =  screenshotTimestampsUrl + sessionId + "/" + timestamp + "/" + direction;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}