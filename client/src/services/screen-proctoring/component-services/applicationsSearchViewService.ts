import * as applicationService from "@/services/screen-proctoring/api-services/applicationsSearchService";
import * as timeUtils from "@/utils/timeUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import {openUrlInNewTab} from "@/router/navigation";
import * as spConstants from "@/utils/sp-constants";

//=============api==============
export async function getExamsStarted(optionalParameters?: OptionalParGetExamsStarted): Promise<SPExam[] | null>{
    try{
        return await applicationService.getExamsStarted(optionalParameters);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getGroupIdsForExam(examId: number): Promise<number[] | null>{
    try{
        return await applicationService.getGroupIdsForExam(examId);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getDistinctMetadataAppForExam(groupIds: string): Promise<string[] | null>{
    try{
        return await applicationService.getDistinctMetadataAppForExam(groupIds);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getDistinctMetadataWindowForExam(groupIds: string, screenProctoringMetadataApplication: string): Promise<DistinctMetadataWindowForExamRecord | null>{
    try{
        return await applicationService.getDistinctMetadataWindowForExam(groupIds, screenProctoringMetadataApplication);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getUserListForApplicationSearch(groupIds: string, screenProctoringMetadataApplication: string, screenProctoringMetadataWindowTitle: string): Promise<UserListForApplicationSearchRecord[] | null>{
    try{
        return await applicationService.getUserListForApplicationSearch(groupIds, screenProctoringMetadataApplication, screenProctoringMetadataWindowTitle);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getTimestampListForApplicationSearch(sessionUUID: string, screenProctoringMetadataApplication: string, screenProctoringMetadataWindowTitle: string): Promise<number[] | null>{
    try{
        return await applicationService.getTimestampListForApplicationSearch(sessionUUID, screenProctoringMetadataApplication, screenProctoringMetadataWindowTitle);        
    }catch(error){
        console.error(error);
        return null;
    }
}