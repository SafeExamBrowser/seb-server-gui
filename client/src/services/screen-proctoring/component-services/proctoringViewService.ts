import * as screenshotDataService from "@/services/screen-proctoring/api-services/screenshotDataService";
import * as timeUtils from "@/utils/timeUtils";
import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";
import * as spConstants from "@/utils/sp-constants";

//= ============api==================
export async function getScreenshotDataBySessionId(
    sessionId: string,
): Promise<ScreenshotData | null> {
    try {
        return await screenshotDataService.getScreenshotDataBySessionId(
            sessionId,
        );
    } catch {
        console.error(error);
        return null;
    }
}

export async function getScreenshotDataByTimestamp(
    sessionId: string,
    timestamp: string,
): Promise<ScreenshotData | null> {
    try {
        return await screenshotDataService.getScreenshotDataByTimestamp(
            sessionId,
            timestamp,
        );
    } catch {
        console.error(error);
        return null;
    }
}

export async function getScreenshotTimestamps(
    sessionId: string,
    timestamp: string,
    direction: SortOrder,
): Promise<number[] | null> {
    try {
        return await screenshotDataService.getScreenshotTimestamps(
            sessionId,
            timestamp,
            direction,
        );
    } catch {
        console.error(error);
        return null;
    }
}
//= =============================

//= ============metadata=========
export function getScreenshotMetadata(
    sliderTime: number,
    currentScreenshotMetadata: MetaData | null,
    additionalMetadataInfo: string,
    total: string,
): object {
    return {
        Total: total,
        Date: timeUtils.formatTimestampToDate(sliderTime),
        Time: timeUtils.formatTimestampToTime(sliderTime),

        [spConstants.APPLICATION_METADATA]:
            currentScreenshotMetadata?.screenProctoringMetadataApplication,
        [spConstants.SEB_BROWSER_TITLE_METADATA]:
            currentScreenshotMetadata?.screenProctoringMetadataBrowser,
        [spConstants.ACTIVITY_DETAILS_METADATA]:
            currentScreenshotMetadata?.screenProctoringMetadataUserAction +
            " " +
            additionalMetadataInfo,
        [spConstants.SEB_BROWSER_URL_METADATA]:
            currentScreenshotMetadata?.screenProctoringMetadataURL,
        [spConstants.WINDOW_TITLE_METADATA]:
            currentScreenshotMetadata?.screenProctoringMetadataWindowTitle,
    };
}

export function getSessionInfodata(session: ScreenshotData | null): object {
    if (session == null) {
        return {};
    }

    return {
        "Client Name:": session.clientName,
        "Client IP:": session.clientIp,
        "Client Version:": session.clientVersion,
        "Client Machine Name:": session.clientMachineName,
        "Client OS:": session.clientOsName,
        "Is Session Active:": session.active.toString(),
    };
}
