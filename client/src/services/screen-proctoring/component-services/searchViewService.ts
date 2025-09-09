import * as searchService from "@/services/screen-proctoring/api-services/searchService";
import * as timeUtils from "@/utils/timeUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import {
    openUrlInNewTab,
    openUrlInNewTabApplicationView,
} from "@/router/navigation";
import * as spConstants from "@/utils/sp-constants";
import { useRoute } from "vue-router";

//= ============api==============
export async function searchSessionsDay(
    optionalParameters?: OptionalParSearchSessions,
): Promise<string[] | null> {
    try {
        return await searchService.searchSessionsDay(optionalParameters);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function searchSessions(
    optionalParameters?: OptionalParSearchSessions,
): Promise<SearchSessions | null> {
    try {
        return await searchService.searchSessions(optionalParameters);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function searchScreenshots(
    optionalParameters?: OptionalParSearchScreenshots,
): Promise<SearchScreenshots | null> {
    try {
        return await searchService.searchScreenshots(optionalParameters);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function searchTimeline(
    sessionId: string,
    optionalParameters?: OptionalParSearchTimeline,
): Promise<SearchTimeline | null> {
    try {
        return await searchService.searchTimeline(
            sessionId,
            optionalParameters,
        );
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteSessions(
    sessionUuids: string[],
): Promise<object | any> {
    try {
        return await searchService.deleteSessions(sessionUuids);
    } catch (error) {
        console.error(error);
        return null;
    }
}
//= =============================

//= ============data prep==============
export function prepareSessionSearchParameters(
    day: string,
    searchParameters: OptionalParSearchSessions,
    serverTablePaging: ServerTablePaging,
): OptionalParSearchSessions {
    const dayTime: { start: string; end: string } =
        timeUtils.getStartAndEndTimestampOfDay(day);
    searchParameters.fromTime = dayTime.start;
    searchParameters.toTime = dayTime.end;

    return tableUtils.assignPagingOptions(serverTablePaging, searchParameters);
}

//= ============window===========
export function openProctoringView(sessionId: string, timestamp?: string) {
    let url: string = spConstants.PROCTORING_VIEW_ROUTE + "/" + sessionId;

    if (timestamp) {
        url =
            spConstants.PROCTORING_VIEW_ROUTE +
            "/" +
            sessionId +
            "?searchTimestamp=" +
            timestamp;
    }

    openUrlInNewTab(url);
}

export function openProctoringApplicationSearch(
    sessionId: string,
    metadataApp: string,
    metadataWindow: string,
) {
    const url: URL = new URL(
        window.location.origin +
            spConstants.PROCTORING_APPLICATION_SEARCH_ROUTE +
            "/" +
            sessionId,
    );
    url.searchParams.set("metadataApp", metadataApp);
    url.searchParams.set("metadataWindow", metadataWindow);

    openUrlInNewTabApplicationView(url.toString());
}
//= =============================
