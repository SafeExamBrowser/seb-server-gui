import * as spConstants from "@/utils/sp-constants.ts";
import {
    openUrlInNewTab,
    openUrlInNewTabApplicationView,
} from "@/router/navigation.ts";

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
