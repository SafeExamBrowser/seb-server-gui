//= ============ TODO change link links============
// TODO @Andrei consider putting this further up depending on whether oether methods in screen proctoring context or otherwise call this up
import { ScreenshotData } from "@/models/screen-proctoring/session.ts";
import { openRouteInNewTab } from "../../../../../router/routeNavigation.ts";
import type { RouteLocationAsRelative } from "vue-router";

export function navigateToProctoringView(
    screenshot: ScreenshotData | undefined,
    examId: string | undefined,
) {
    console.log("examId" + examId);
    if (screenshot != null && examId !== undefined) {
        openRouteInNewTab({
            name: "/(app)/monitoring/[examId]/client/[connectionToken]/",
            params: {
                examId,
                connectionToken: screenshot.uuid,
            },
        } satisfies RouteLocationAsRelative<"/(app)/monitoring/[examId]/client/[connectionToken]/">);
    }
}
