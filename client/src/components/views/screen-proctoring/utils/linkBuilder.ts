import { ScreenshotData } from "@/models/screen-proctoring/session.ts";
import { useAuthStore } from "@/stores/authentication/authenticationStore.ts";
import { StorageItemEnum } from "@/models/StorageItemEnum.ts";

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

    return (
        screenshot.latestImageLink +
        "/" +
        timestamp +
        "?access_token=" +
        authStore.getStorageItem(StorageItemEnum.SP_ACCESS_TOKEN)
    );
}
