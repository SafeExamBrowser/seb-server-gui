import {
    DistinctMetadataWindowForExamRecord,
    UserListForApplicationSearchRecord,
} from "@/models/screen-proctoring/applicationSearch";
import { SPExam } from "@/models/screen-proctoring/exam";
import { OptionalParGetExamsStarted } from "@/models/screen-proctoring/optionalParamters";
import * as apiService from "@/services/apiService";

const baseUrl = "/sps/proctoring/search/applications" as const;

export const getExamsStarted = async (
    optionalParameters?: OptionalParGetExamsStarted,
): Promise<SPExam[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/exams`,
            options: {
                _authType: "sps",
                params: optionalParameters,
            },
        })
    ).data;

export const getGroupIdsForExam = async (examId: number): Promise<number[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/groupIds/${examId}`,
            options: { _authType: "sps" },
        })
    ).data;

export const getDistinctMetadataAppForExam = async (
    groupIds: string,
): Promise<string[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/metadata/app`,
            options: {
                _authType: "sps",
                params: { groupIds },
            },
        })
    ).data;

export const getDistinctMetadataWindowForExam = async (
    groupIds: string,
    screenProctoringMetadataApplication: string,
): Promise<DistinctMetadataWindowForExamRecord> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/metadata/window`,
            options: {
                _authType: "sps",
                params: { groupIds, screenProctoringMetadataApplication },
            },
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
                _authType: "sps",
                params: {
                    groupIds,
                    screenProctoringMetadataApplication,
                    screenProctoringMetadataWindowTitle,
                },
            },
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
                _authType: "sps",
                params: {
                    sessionUUID,
                    screenProctoringMetadataApplication,
                    screenProctoringMetadataWindowTitle,
                },
            },
        })
    ).data;
