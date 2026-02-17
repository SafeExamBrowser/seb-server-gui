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

// no logic in this file
export async function applySEBLock(
    id: string,
    enableSEBLock: boolean,
): Promise<Exam | null> {
    const url: string = "/exam/" + id + "/apply-seb-restriction";
    if (enableSEBLock) {
        return (
            await apiService.api.put(
                url,
                {},
                {
                    headers: apiService.getHeaders(
                        StorageItemEnum.ACCESS_TOKEN,
                    ),
                },
            )
        ).data;
    } else {
        return (
            await apiService.api.delete(url, {
                headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            })
        ).data;
    }
}

export async function checkSEBLock(id: string): Promise<boolean> {
    const url: string = "/exam/" + id + "/check-seb-restriction";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}
