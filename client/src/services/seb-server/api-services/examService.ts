import * as newApiService from "@/services/newApiService";

import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
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

// TODO @alain: migrate, as soon as I know how to test it
export async function grantExamAppSignatureKeys(
    tagName: string,
    parentId: string,
    id: string,
): Promise<GrantedAppSignatureKey> {
    const url = `${baseUrl}/${parentId}/grant/${id}`;
    return (
        await apiService.api.post(url, null, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { tag: tagName },
        })
    ).data;
}

// TODO @alain: migrate, as soon as I know how to test it
export async function removeGrantExamAppSignatureKeys(
    parentId: string,
    id: string,
): Promise<AppSignatureKey[]> {
    const url: string = baseUrl + "/" + parentId + "/grant" + "/" + id;
    return (
        await apiService.api.delete(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

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
