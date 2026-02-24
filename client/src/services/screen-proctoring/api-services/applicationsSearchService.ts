import * as newApiService from "@/services/newApiService";
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
        await newApiService.getRequest(`${baseUrl}/exams`, {
            params: optionalParameters,
        })
    ).data;

// TODO @andreas: please test this
export const getGroupIdsForExam = async (examId: number): Promise<number[]> =>
    (await newApiService.getRequest(`${baseUrl}/groupIds/${examId}`)).data;

// TODO @andreas: please test this
export const getDistinctMetadataAppForExam = async (
    groupIds: string,
): Promise<string[]> =>
    (
        await newApiService.getRequest(`${baseUrl}/metadata/app`, {
            params: { groupIds },
        })
    ).data;

// TODO @andreas: please test this
export const getDistinctMetadataWindowForExam = async (
    groupIds: string,
    screenProctoringMetadataApplication: string,
): Promise<DistinctMetadataWindowForExamRecord> =>
    (
        await newApiService.getRequest(`${baseUrl}/metadata/window`, {
            params: { groupIds, screenProctoringMetadataApplication },
        })
    ).data;

// TODO @andreas: please test this
export const getUserListForApplicationSearch = async (
    groupIds: string,
    screenProctoringMetadataApplication: string,
    screenProctoringMetadataWindowTitle: string,
): Promise<UserListForApplicationSearchRecord[]> =>
    (
        await newApiService.getRequest(`${baseUrl}/users`, {
            params: {
                groupIds,
                screenProctoringMetadataApplication,
                screenProctoringMetadataWindowTitle,
            },
        })
    ).data;

// TODO @andreas: please test this
export const getTimestampListForApplicationSearch = async (
    sessionUUID: string,
    screenProctoringMetadataApplication: string,
    screenProctoringMetadataWindowTitle: string,
): Promise<number[]> =>
    (
        await newApiService.getRequest(`${baseUrl}/timestamps`, {
            params: {
                sessionUUID,
                screenProctoringMetadataApplication,
                screenProctoringMetadataWindowTitle,
            },
        })
    ).data;
