import * as apiService from "@/services/apiService";
import { OptionalParGetExamsStarted } from "@/models/screen-proctoring/optionalParamters";
import { SPExam } from "@/models/screen-proctoring/exam";
import {
    DistinctMetadataWindowForExamRecord,
    UserListForApplicationSearchRecord,
} from "@/models/screen-proctoring/applicationSearch";

const baseUrl = "/proctoring/search/applications" as const;

export const getExamsStarted = async (
    optionalParameters?: OptionalParGetExamsStarted,
): Promise<SPExam[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/exams`,
            options: {
                params: optionalParameters,
            },
            authType: "sps",
        })
    ).data;

export const getGroupIdsForExam = async (examId: number): Promise<number[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/groupIds/${examId}`,
            authType: "sps",
        })
    ).data;

export const getDistinctMetadataAppForExam = async (
    groupIds: string,
): Promise<string[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/metadata/app`,
            options: {
                params: { groupIds },
            },
            authType: "sps",
        })
    ).data;

// TODO @andreas This is missing mandatory parameter "screenProctoringMetadataApplication"
//               Maybe if screenProctoringMetadataApplication is null it should send empty string
export const getDistinctMetadataWindowForExam = async (
    groupIds: string,
    screenProctoringMetadataApplication: string,
): Promise<DistinctMetadataWindowForExamRecord> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/metadata/window`,
            options: {
                params: { groupIds, screenProctoringMetadataApplication },
            },
            authType: "sps",
        })
    ).data;

export const getUserListForApplicationSearch = async (
    groupIds: string,
    screenProctoringMetadataApplication: string,
    screenProctoringMetadataWindowTitle: string,
): Promise<UserListForApplicationSearchRecord[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/users`,
            options: {
                params: {
                    groupIds,
                    screenProctoringMetadataApplication,
                    screenProctoringMetadataWindowTitle,
                },
            },
            authType: "sps",
        })
    ).data;

export const getTimestampListForApplicationSearch = async (
    sessionUUID: string,
    screenProctoringMetadataApplication: string,
    screenProctoringMetadataWindowTitle: string,
): Promise<number[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/timestamps`,
            options: {
                params: {
                    sessionUUID,
                    screenProctoringMetadataApplication,
                    screenProctoringMetadataWindowTitle,
                },
            },
            authType: "sps",
        })
    ).data;
