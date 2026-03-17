import * as apiService from "@/services/apiService";
import { OptionalParGetExams } from "@/models/seb-server/optionalParamters";
import { CreateExamPar, Exam, Exams } from "@/models/seb-server/exam";
import {
    AppSignatureKey,
    GrantedAppSignatureKey,
} from "@/models/seb-server/appSignatureKey";

const baseUrl = "/exam" as const;

export const getExam = async (id: string): Promise<Exam> =>
    (await apiService.getRequest({ url: `${baseUrl}/${id}` })).data;

export const createExam = async (createExamPar: CreateExamPar): Promise<Exam> =>
    (await apiService.postRequest({ url: baseUrl, data: createExamPar })).data;

export const updateExam = async (exam: Exam): Promise<Exam> =>
    (await apiService.putRequest({ url: baseUrl, data: exam })).data;

export const deleteExam = async (id: string): Promise<unknown | null> =>
    (await apiService.deleteRequest({ url: `${baseUrl}/${id}` })).data;

export const getExams = async (
    optionalParameters?: OptionalParGetExams,
): Promise<Exams> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: {
                params: optionalParameters,
            },
        })
    ).data;

export const archiveExam = async (id: string): Promise<Exam> =>
    (await apiService.patchRequest({ url: `${baseUrl}/${id}/archive` })).data;

export const getExamAppSignatureKeys = async (
    id: string,
): Promise<AppSignatureKey[]> =>
    (await apiService.getRequest({ url: `${baseUrl}/${id}/sebkeyinfo` })).data;

export const getGrantedExamAppSignatureKeys = async (
    parentId: string,
): Promise<GrantedAppSignatureKey[]> =>
    (await apiService.getRequest({ url: `${baseUrl}/${parentId}/grant` })).data;

export const grantExamAppSignatureKeys = async (
    tagName: string,
    parentId: string,
    id: string,
): Promise<GrantedAppSignatureKey> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${parentId}/grant/${id}`,
            data: {},
            options: {
                params: { tag: tagName },
            },
        })
    ).data;

export const removeGrantExamAppSignatureKeys = async (
    parentId: string,
    id: string,
): Promise<AppSignatureKey[]> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}/${parentId}/grant/${id}`,
        })
    ).data;

export const checkSEBLock = async (id: string): Promise<boolean> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${id}/check-seb-restriction`,
        })
    ).data;

export const addSEBLock = async (id: string): Promise<Exam> =>
    (await apiService.putRequest({ url: `${baseUrl}/${id}/seb-restriction` }))
        .data;

export const removeSEBLock = async (id: string): Promise<null> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}/${id}/seb-restriction`,
        })
    ).data;
