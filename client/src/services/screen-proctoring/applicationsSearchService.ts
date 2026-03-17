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
        await apiService.getRequest(
            `${baseUrl}/exams`,
            {
                params: optionalParameters,
            },
            "sps",
        )
    ).data;

export const getGroupIdsForExam = async (examId: number): Promise<number[]> =>
    (
        await apiService.getRequest(
            `${baseUrl}/groupIds/${examId}`,
            undefined,
            "sps",
        )
    ).data;

export const getDistinctMetadataAppForExam = async (
    groupIds: string,
): Promise<string[]> =>
    (
        await apiService.getRequest(
            `${baseUrl}/metadata/app`,
            {
                params: { groupIds },
            },
            "sps",
        )
    ).data;

// TODO @andreas This is missing mandatory parameter "screenProctoringMetadataApplication"
//               Maybe if screenProctoringMetadataApplication is null it should send empty string
export const getDistinctMetadataWindowForExam = async (
    groupIds: string,
    screenProctoringMetadataApplication: string,
): Promise<DistinctMetadataWindowForExamRecord> =>
    (
        await apiService.getRequest(
            `${baseUrl}/metadata/window`,
            {
                params: { groupIds, screenProctoringMetadataApplication },
            },
            "sps",
        )
    ).data;

export const getUserListForApplicationSearch = async (
    groupIds: string,
    screenProctoringMetadataApplication: string,
    screenProctoringMetadataWindowTitle: string,
): Promise<UserListForApplicationSearchRecord[]> =>
    (
        await apiService.getRequest(
            `${baseUrl}/users`,
            {
                params: {
                    groupIds,
                    screenProctoringMetadataApplication,
                    screenProctoringMetadataWindowTitle,
                },
            },
            "sps",
        )
    ).data;

export const getTimestampListForApplicationSearch = async (
    sessionUUID: string,
    screenProctoringMetadataApplication: string,
    screenProctoringMetadataWindowTitle: string,
): Promise<number[]> =>
    (
        await apiService.getRequest(
            `${baseUrl}/timestamps`,
            {
                params: {
                    sessionUUID,
                    screenProctoringMetadataApplication,
                    screenProctoringMetadataWindowTitle,
                },
            },
            "sps",
        )
    ).data;
