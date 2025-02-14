import * as apiService from "@/services/api-services/apiService";

const examUrl: string = "/exam";
const examsUrl: string = "/exams";

export async function getExam(id: string): Promise<Exam | any>{
    const url: string = "/get-exam/" + id;
    return (await apiService.api.get(url, {headers: apiService.getHeaders()})).data;
}

export async function createExam(createExamPar: CreateExamPar): Promise<any>{
    return (await apiService.api.post(examUrl, createExamPar, {headers: apiService.getPostHeaders()})).data;
}

export async function getExams(optionalParamters?: OptionalParGetExams): Promise<Exams | any>{
    return (await apiService.api.get(examsUrl, {headers: apiService.getHeaders(), params: {optionalParamters}})).data;
}