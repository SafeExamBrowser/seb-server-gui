import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import {
    SearchScreenshots,
    SearchSessions,
    SearchTimeline,
} from "@/models/screen-proctoring/search";
import {
    OptionalParSearchScreenshots,
    OptionalParSearchSessions,
    OptionalParSearchTimeline,
} from "@/models/screen-proctoring/optionalParamters";

export async function searchSessionsDay(
    optionalParameters?: OptionalParSearchSessions,
): Promise<string[] | any> {
    const url: string = "/sp/search/sessions/day";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function searchSessions(
    optionalParameters?: OptionalParSearchSessions,
): Promise<SearchSessions | any> {
    const url: string = "/sp/search/sessions";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function searchScreenshots(
    optionalParameters?: OptionalParSearchScreenshots,
): Promise<SearchScreenshots | any> {
    const url: string = "/sp/search/screenshots";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function searchTimeline(
    sessionId: string,
    optionalParameters?: OptionalParSearchTimeline,
): Promise<SearchTimeline | any> {
    const url: string = "/sp/search/timeline/" + sessionId;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function deleteSessions(
    sessionUuids: string[],
): Promise<object | any> {
    const url: string =
        "/sp/search/sessions/delete" +
        apiService.createSessionDeleteUrlSuffix(sessionUuids);
    return apiService.api.delete(url, {
        headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
    });
}
