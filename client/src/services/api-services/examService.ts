import * as apiService from "@/services/api-services/apiService";




export async function createExam(createExamPar: CreateExamPar): Promise<any>{
    const url: string = "/exam";
    return (await apiService.api.post(url, createExamPar, {headers: apiService.getPostHeaders()})).data;
}