//= ============ TODO change link links============
// TODO @Andrei consider putting this further up depending on whether oether methods in screen proctoring context or otherwise call this up
import { ScreenshotData } from "@/models/screen-proctoring/session.ts";
import { openUrlInNewTab } from "@/router/navigation.ts";
import * as constants from "@/utils/constants";

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
