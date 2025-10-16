import { useAuthStore } from "@/stores/authentication/authenticationStore";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import * as spConstants from "@/utils/sp-constants";
import { ScreenshotData } from "@/models/screen-proctoring/session";

export function getLatestImageLink(
    screenshot: ScreenshotData | undefined,
    timestamp: string,
): string {
    const authStore = useAuthStore();

    if (screenshot == null) return "";

    const screenshotLink: string =
        screenshot.latestImageLink +
        "?access_token=" +
        authStore.getStorageItem(StorageItemEnum.SP_ACCESS_TOKEN);

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
        authStore.getStorageItem(StorageItemEnum.SP_ACCESS_TOKEN);

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
