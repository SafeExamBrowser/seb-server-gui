import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { OptionalParGetExamsStarted } from "@/models/screen-proctoring/optionalParamters";
import { SPExam } from "@/models/screen-proctoring/exam";
import {
    DistinctMetadataWindowForExamRecord,
    UserListForApplicationSearchRecord,
} from "@/models/screen-proctoring/applicationSearch";

export async function getExamsStarted(
    optionalParameters?: OptionalParGetExamsStarted,
): Promise<SPExam[]> {
    const url: string = "/sp/search/applications/exams";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function getGroupIdsForExam(examId: number): Promise<number[]> {
    const url: string = "/sp/search/applications/groupIds/" + examId;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
        })
    ).data;
}

export async function getDistinctMetadataAppForExam(
    groupIds: string,
): Promise<string[]> {
    const url: string = "/sp/search/applications/metadata/app";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: { groupIds },
        })
    ).data;
}

export async function getDistinctMetadataWindowForExam(
    groupIds: string,
    screenProctoringMetadataApplication: string,
): Promise<DistinctMetadataWindowForExamRecord> {
    const url: string = "/sp/search/applications/metadata/window";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: { groupIds, screenProctoringMetadataApplication },
        })
    ).data;
}

export async function getUserListForApplicationSearch(
    groupIds: string,
    screenProctoringMetadataApplication: string,
    screenProctoringMetadataWindowTitle: string,
): Promise<UserListForApplicationSearchRecord[]> {
    const url: string = "/sp/search/applications/users";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: {
                groupIds,
                screenProctoringMetadataApplication,
                screenProctoringMetadataWindowTitle,
            },
        })
    ).data;
}

export async function getTimestampListForApplicationSearch(
    sessionUUID: string,
    screenProctoringMetadataApplication: string,
    screenProctoringMetadataWindowTitle: string,
): Promise<number[]> {
    const url: string = "/sp/search/applications/timestamps";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: {
                sessionUUID,
                screenProctoringMetadataApplication,
                screenProctoringMetadataWindowTitle,
            },
        })
    ).data;
}
