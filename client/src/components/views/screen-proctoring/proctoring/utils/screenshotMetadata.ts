import {
    MetaData,
    ScreenshotData,
} from "@/models/screen-proctoring/session.ts";
import * as timeUtils from "@/utils/timeUtils.ts";
import * as spConstants from "@/utils/sp-constants.ts";

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
