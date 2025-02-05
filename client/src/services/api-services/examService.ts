import * as apiService from "@/services/api-services/apiService";

const examUrl: string = "/exam";

export async function getExam(id: string): Promise<Exam | any>{
    const url: string = examUrl + "/" + id;
    return (await apiService.api.get(url, {headers: apiService.getHeaders()})).data;
}

export async function createExam(createExamPar: CreateExamPar): Promise<any>{
    return (await apiService.api.post(examUrl, createExamPar, {headers: apiService.getPostHeaders()})).data;
}