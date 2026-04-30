import * as spConstants from "@/utils/sp-constants.ts";
import { openUrlInNewTab } from "@/router/navigation.ts";

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
    let url: string =
        spConstants.PROCTORING_APPLICATION_SEARCH_ROUTE + "/" + sessionId;
    let query: string | undefined = undefined;

    if (metadataApp) {
        query = "metadataApp=" + metadataApp;
    }
    if (metadataWindow) {
        if (query) {
            query = query + "&";
        }
        query = query + "metadataWindow=" + metadataWindow;
    }
    if (query) {
        url = url + "?" + query;
    }

    openUrlInNewTab(url.toString());
}
