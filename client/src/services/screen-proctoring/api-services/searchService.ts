import * as apiService from "@/services/apiService";
import * as newApiService from "@/services/newApiService";
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

export const searchSessions = async (
    optionalParameters?: OptionalParSearchSessions,
): Promise<SearchSessions> =>
    (
        await newApiService.getRequest(`${baseUrl}/sessions`, {
            params: optionalParameters,
        })
    ).data;

export const searchTimeline = async (
    sessionId: string,
    optionalParameters?: OptionalParSearchTimeline,
): Promise<SearchTimeline> =>
    (
        await newApiService.getRequest(`${baseUrl}/timeline/${sessionId}`, {
            params: optionalParameters,
        })
    ).data;

// TODO @andreas: We have to check if this is still a feature (with the new deletion strategy
//                If yes, the current URL is wrong and should point to /session (no baseUrl) and with form-url-encoded header
export const deleteSessions = async (
    sessionUuids: string[],
): Promise<AxiosResponse<object>> =>
    (
        await newApiService.deleteRequest(
            `${baseUrl}/session${apiService.createSessionDeleteUrlSuffix(sessionUuids)}`,
        )
    ).data;
