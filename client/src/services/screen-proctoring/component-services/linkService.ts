import { useAuthStore } from "@/composables/store/useAuthStore";
import * as spConstants from "@/utils/sp-constants";
import { ScreenshotData } from "@/models/screen-proctoring/session";

export function getLatestImageLink(
    screenshot: ScreenshotData | undefined,
    timestamp: string,
): string {
    const authStore = useAuthStore();

    if (screenshot == null) return "";

    const screenshotLink: string =
        screenshot.latestImageLink + "?access_token=" + authStore.spAccessToken;

    if (screenshot.active) {
        return screenshotLink + "&t=" + timestamp;
    }

    return screenshotLink;
}

export function getSpecificImageLink(
    screenshot: ScreenshotData | undefined,
    timestamp: string,
): string {
    const authStore = useAuthStore();

    if (screenshot == null) return "";

    const screenshotLink: string =
        screenshot.latestImageLink +
        "/" +
        timestamp +
        "?access_token=" +
        authStore.spAccessToken;

    return screenshotLink;
}

export function getGalleryViewLink(groupUuid: string): string {
    return spConstants.GALLERY_VIEW_ROUTE + "/" + groupUuid;
}

export function getGalleryViewLinkByExamId(
    groupUuid: string,
    examId: string,
): string {
    return (
        spConstants.GALLERY_VIEW_ROUTE +
        "/" +
        groupUuid +
        spConstants.EXAM_ID +
        "/" +
        examId
    );
}
