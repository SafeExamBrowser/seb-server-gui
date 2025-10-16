import * as groupService from "@/services/screen-proctoring/api-services/groupService";
import * as screenshotDataService from "@/services/screen-proctoring/api-services/screenshotDataService";
import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";
import { openUrlInNewTab } from "@/router/navigation";
import * as spConstants from "@/utils/sp-constants";
import * as constants from "@/utils/constants";
import { MetaData, ScreenshotData } from "@/models/screen-proctoring/session";
import { GroupUuid } from "@/models/screen-proctoring/group";

//= ============api==============
export async function getGroup(
    groupUuid: string,
    currentWindow: number,
    pageSize: number,
    sortOrder: SortOrder,
): Promise<GroupUuid | null> {
    try {
        const groupUuidResponse: GroupUuid = await groupService.getGroupByUuid(
            groupUuid,
            {
                pageNumber: (currentWindow += 1),
                pageSize: Math.pow(pageSize, 2),
                sortOrder,
                // sortBy: "clientName",
            },
        );

        return groupUuidResponse;
    } catch (error: any) {
        console.error(error);
        if (error.response) {
            return error.response.data;
        }

        return null;
    }
}

export async function getLatestScreenshotData(
    sessionUuid: string,
    timestamp: number,
): Promise<ScreenshotData | null> {
    try {
        return await screenshotDataService.getScreenshotDataByTimestamp(
            sessionUuid,
            timestamp.toString(),
        );
    } catch (error) {
        console.error(error);
        return null;
    }
}

//= ============index============
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

//= ============ TODO change link links============
export function navigateToProctoringView(
    screenshot: ScreenshotData | undefined,
    examId: string | undefined,
) {
    console.log("examId" + examId);
    if (screenshot != null && examId !== undefined) {
        openUrlInNewTab(
            constants.MONITORING_ROUTE +
                "/" +
                examId +
                "/details/" +
                screenshot.uuid,
        );
    }
}

//= ============metadata=========
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
