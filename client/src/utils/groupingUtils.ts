import * as timeUtils from "@/utils/timeUtils";

//todo: improve this function
export function groupScreenshotsByMetadata(screenshotGroupList: ScreenshotGroup[], isSearchView: boolean): ScreenshotsGrouped[] | null{

    //todo: extract metadata from par
    // const metadataGroupPar: string = "screenProctoringMetadataUserAction"

    if(screenshotGroupList == null || screenshotGroupList.length == 0){
        return null;
    }

    const groups: ScreenshotsGrouped[] = [];

    let currentGroup: ScreenshotsGrouped = {
        groupName: screenshotGroupList[0].metaData.screenProctoringMetadataUserAction!, 
        timelineScreenshotDataList: [
            {
                timestamp: screenshotGroupList[0].timestamp,
                metaData: screenshotGroupList[0].metaData
            }
        ]
    };

    if(screenshotGroupList.length !< 0){
        return null;
    }

    for(let i = 1; i < screenshotGroupList.length; i++){

        if(currentGroup.groupName == screenshotGroupList[i].metaData.screenProctoringMetadataUserAction){
            currentGroup.timelineScreenshotDataList.push(screenshotGroupList[i]);

        }else{
            groups.push(currentGroup);

            currentGroup = {
                groupName: screenshotGroupList[i].metaData.screenProctoringMetadataUserAction!,
                timelineScreenshotDataList: [
                    {
                        timestamp: screenshotGroupList[i].timestamp,
                        metaData: screenshotGroupList[i].metaData
                    }
                ]
            }
        }
    }

    if(!groups.includes(currentGroup)){
        groups.push(currentGroup);
    }

    if(isSearchView){
        //remove first element, because first item is already shown in group header
        groups.shift();
    }
    

    return groups;
}