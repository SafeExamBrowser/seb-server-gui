import * as apiService from "@/services/apiService";
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
        await apiService.getRequest(
            `${baseUrl}/sessions/day`,
            {
                params: optionalParameters,
            },
            "sps",
        )
    ).data;

export const searchSessions = async (
    optionalParameters?: OptionalParSearchSessions,
): Promise<SearchSessions> =>
    (
        await apiService.getRequest(
            `${baseUrl}/sessions`,
            {
                params: optionalParameters,
            },
            "sps",
        )
    ).data;

export const searchTimeline = async (
    sessionId: string,
    optionalParameters?: OptionalParSearchTimeline,
): Promise<SearchTimeline> =>
    (
        await apiService.getRequest(
            `${baseUrl}/timeline/${sessionId}`,
            {
                params: optionalParameters,
            },
            "sps",
        )
    ).data;

// TODO @andreas: We have to check if this is still a feature (with the new deletion strategy
//                If yes, the current URL is wrong and should point to /session (no baseUrl) and with form-url-encoded header
export const deleteSessions = async (
    sessionUuids: string[],
): Promise<AxiosResponse<object>> => {
    const createSessionDeleteUrlSuffix = (sessionUuids: string[]): string => {
        // TODO @andreas: if we keep this function, it could be simplified a lot by using URLSearchParams (https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
        let urlSuffix = "?modelIds=";

        for (let i = 0; i < sessionUuids.length; i++) {
            urlSuffix += sessionUuids[i];

            if (i !== sessionUuids.length - 1) {
                urlSuffix += "&modelIds=";
            }
        }

        return urlSuffix;
    };

    return (
        await apiService.deleteRequest(
            `${baseUrl}/session${createSessionDeleteUrlSuffix(sessionUuids)}`,
            undefined,
            "sps",
        )
    ).data;
};
