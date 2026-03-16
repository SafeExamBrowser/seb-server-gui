import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";
import {
    MetaData,
    ScreenshotData,
} from "@/models/screen-proctoring/session.ts";
import * as spConstants from "@/utils/sp-constants.ts";

export function buildGroupQueryParams(
    currentWindow: number,
    gridSize: number,
    sortOrder: SortOrder,
) {
    return {
        pageNumber: currentWindow + 1,
        pageSize: gridSize * gridSize,
        sortOrder,
    };
}

export function getScreenshotMetadata(
    currentScreenshotMetadata: MetaData | null | undefined,
): object {
    return {
        [spConstants.APPLICATION_METADATA + ":"]:
            currentScreenshotMetadata?.screenProctoringMetadataApplication,
        [spConstants.SEB_BROWSER_TITLE_METADATA + ":"]:
            currentScreenshotMetadata?.screenProctoringMetadataBrowser,
        [spConstants.ACTIVITY_DETAILS_METADATA + ":"]:
            currentScreenshotMetadata?.screenProctoringMetadataUserAction,
        [spConstants.SEB_BROWSER_URL_METADATA + ":"]:
            currentScreenshotMetadata?.screenProctoringMetadataURL,
        [spConstants.WINDOW_TITLE_METADATA + ":"]:
            currentScreenshotMetadata?.screenProctoringMetadataWindowTitle,
    };
}

export function calcIndex(i: number, n: number, gridSize: number): number {
    return (i - 1) * gridSize + (n - 1);
}

export function currentIndexExists(
    screenshots: ScreenshotData[] | undefined,
    index: number,
): boolean {
    if (screenshots != null && screenshots.length > index) {
        return true;
    }

    return false;
}
