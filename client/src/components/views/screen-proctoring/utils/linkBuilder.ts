import { ScreenshotData } from "@/models/screen-proctoring/session.ts";
import { useAuthStore } from "@/composables/store/useAuthStore";

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

    return (
        screenshot.latestImageLink +
        "/" +
        timestamp +
        "?access_token=" +
        authStore.spAccessToken
    );
}
