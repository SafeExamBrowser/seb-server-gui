import { useAuthStore } from "@/stores/store";

export function getLatestImageLink(screenshot: ScreenshotData | undefined, timestamp: string): string {
    const authStore = useAuthStore();

    if(screenshot == null) return "";

    const screenshotLink: string = screenshot.latestImageLink + "?access_token=" + authStore.getAccessToken("accessToken");

    if(screenshot.active){
        return screenshotLink + '&t=' + timestamp;
    }

    return screenshotLink;
}

export function getSpecificImageLink(screenshot: ScreenshotData | undefined, timestamp: string): string {
    const authStore = useAuthStore();

    if(screenshot == null) return "";

    const screenshotLink: string = screenshot.latestImageLink + "/" + timestamp + "?access_token=" + authStore.getAccessToken("accessToken");

    return screenshotLink;
}