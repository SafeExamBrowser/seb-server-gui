import * as apiService from "@/services/apiService";
import * as newApiService from "@/services/newApiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import {
    SearchSessions,
    SearchTimeline,
} from "@/models/screen-proctoring/search";
import {
    OptionalParSearchSessions,
    OptionalParSearchTimeline,
} from "@/models/screen-proctoring/optionalParamters";
import { AxiosResponse } from "axios";

const baseUrl = "/proctoring/search" as const;

export const searchSessionsDay = async (
    optionalParameters?: OptionalParSearchSessions,
): Promise<string[]> =>
    (
        await newApiService.getRequest(`${baseUrl}/sessions/day`, {
            params: optionalParameters,
        })
    ).data;

// TODO @andreas: please test this
export const searchSessions = async (
    optionalParameters?: OptionalParSearchSessions,
): Promise<SearchSessions> =>
    (
        await newApiService.getRequest(`${baseUrl}/sessions`, {
            params: optionalParameters,
        })
    ).data;

// TODO @andreas: please test this
export const searchTimeline = async (
    sessionId: string,
    optionalParameters?: OptionalParSearchTimeline,
): Promise<SearchTimeline> =>
    (
        await newApiService.getRequest(`${baseUrl}/timeline/${sessionId}`, {
            params: optionalParameters,
        })
    ).data;

export async function deleteSessions(
    sessionUuids: string[],
): Promise<AxiosResponse<object>> {
    const url: string =
        "/sp/search/sessions/delete" +
        apiService.createSessionDeleteUrlSuffix(sessionUuids);

    return apiService.api.delete<object>(url, {
        headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
    });
}
