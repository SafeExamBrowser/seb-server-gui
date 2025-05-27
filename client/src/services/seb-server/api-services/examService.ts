import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const examUrl: string = "/exam";
const examsUrl: string = "/exams";

export async function getExam(id: string): Promise<Exam | any>{
    const url: string = "/get-exam/" + id;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function createExam(createExamPar: CreateExamPar): Promise<Exam | any>{
    return (await apiService.api.post(examUrl, createExamPar, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function deleteExam(id: string): Promise<any | null>{
    return (await apiService.api.delete(examUrl + "/" + id, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function updateExam(id: string, exam: Exam): Promise<Exam | any>{
    return (await apiService.api.put(examUrl + "/" + id, exam, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function getExams(optionalParamters?: OptionalParGetExams): Promise<Exams | any>{
    return (await apiService.api.get(examsUrl, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: {optionalParamters}})).data;
}

export async function archiveExam(id: string): Promise<Exam | any>{
    return (await apiService.api.patch(examUrl + "/" + id + "/archive", {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

//no logic in this file
export async function applySEBLock(id: string, enableSEBLock: boolean): Promise<Exam | null>{
    const url: string =  "/exam/" + id + "/apply-seb-restriction";
    if (enableSEBLock) {
        return (await apiService.api.put(url, {}, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
    } else {
        return (await apiService.api.delete(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
    }
}

export async function checkSEBLock(id: string): Promise<boolean>{
    const url: string =  "/exam/" + id + "/check-seb-restriction";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}