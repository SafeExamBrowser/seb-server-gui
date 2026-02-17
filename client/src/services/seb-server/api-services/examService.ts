import * as newApiService from "@/services/newApiService";
import { OptionalParGetExams } from "@/models/seb-server/optionalParamters";
import { CreateExamPar, Exam, Exams } from "@/models/seb-server/exam";
import {
    AppSignatureKey,
    GrantedAppSignatureKey,
} from "@/models/seb-server/appSignatureKey";

const baseUrl = "/exam" as const;

export const getExam = async (id: string): Promise<Exam> =>
    (await newApiService.getRequest(`${baseUrl}/${id}`)).data;

export const createExam = async (createExamPar: CreateExamPar): Promise<Exam> =>
    (
        await newApiService.postRequest(baseUrl, createExamPar, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
    ).data;

export const updateExam = async (exam: Exam): Promise<Exam> =>
    (await newApiService.putRequest(baseUrl, exam)).data;

export const deleteExam = async (id: string): Promise<unknown | null> =>
    (await newApiService.deleteRequest(`${baseUrl}/${id}`)).data;

export const getExams = async (
    optionalParameters?: OptionalParGetExams,
): Promise<Exams> =>
    (
        await newApiService.getRequest(baseUrl, {
            params: optionalParameters,
        })
    ).data;

export const archiveExam = async (id: string): Promise<Exam> =>
    (await newApiService.patchRequest(`${baseUrl}/${id}/archive`)).data;

export const getExamAppSignatureKeys = async (
    id: string,
): Promise<AppSignatureKey[]> =>
    (await newApiService.getRequest(`${baseUrl}/${id}/sebkeyinfo`)).data;

export const getGrantedExamAppSignatureKeys = async (
    parentId: string,
): Promise<GrantedAppSignatureKey[]> =>
    (await newApiService.getRequest(`${baseUrl}/${parentId}/grant`)).data;

// TODO @andreas: please test this (source of error could be both the Content-Type header and the tag parameter)
export const grantExamAppSignatureKeys = async (
    tagName: string,
    parentId: string,
    id: string,
): Promise<GrantedAppSignatureKey> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${parentId}/grant/${id}`,
            {},
            {
                params: { tag: tagName },
            },
        )
    ).data;

// TODO @andreas: please test this
export const removeGrantExamAppSignatureKeys = async (
    parentId: string,
    id: string,
): Promise<AppSignatureKey[]> =>
    (await newApiService.deleteRequest(`${baseUrl}/${parentId}/grant/${id}`))
        .data;

export const checkSEBLock = async (id: string): Promise<boolean> =>
    (await newApiService.getRequest(`${baseUrl}/${id}/check-seb-restriction`))
        .data;

export const addSEBLock = async (id: string): Promise<Exam> =>
    (
        await newApiService.putRequest(
            `${baseUrl}/${id}/seb-restriction`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

export const removeSEBLock = async (id: string): Promise<null> =>
    (await newApiService.deleteRequest(`${baseUrl}/${id}/seb-restriction`))
        .data;
