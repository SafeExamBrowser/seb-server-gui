import {
    ScreenshotGroup,
    ScreenshotsGrouped,
} from "@/models/screen-proctoring/search";

export function groupScreenshotsByMetadata(
    screenshotGroupList: ScreenshotGroup[],
    isSearchView: boolean,
): ScreenshotsGrouped[] | null {
    if (!screenshotGroupList || screenshotGroupList.length === 0) {
        return null;
    }

    const groups: ScreenshotsGrouped[] = [];

    const getAction = (g: ScreenshotGroup): string =>
        g.metaData?.screenProctoringMetadataUserAction ?? "Unknown";

    let currentGroup: ScreenshotsGrouped = {
        groupName: getAction(screenshotGroupList[0]),
        timelineScreenshotDataList: [
            {
                timestamp: screenshotGroupList[0].timestamp,
                metaData: screenshotGroupList[0].metaData,
            },
        ],
    };

    for (let i = 1; i < screenshotGroupList.length; i++) {
        const item = screenshotGroupList[i];
        const action = getAction(item);

        if (currentGroup.groupName === action) {
            currentGroup.timelineScreenshotDataList.push({
                timestamp: item.timestamp,
                metaData: item.metaData,
            });
        } else {
            groups.push(currentGroup);
            currentGroup = {
                groupName: action,
                timelineScreenshotDataList: [
                    { timestamp: item.timestamp, metaData: item.metaData },
                ],
            };
        }
    }

    groups.push(currentGroup);

    if (isSearchView) {
        for (const g of groups) {
            if (g.timelineScreenshotDataList.length > 0) {
                g.timelineScreenshotDataList.shift();
            }
        }
    }

    return groups;
}
