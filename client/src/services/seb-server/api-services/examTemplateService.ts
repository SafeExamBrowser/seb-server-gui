import * as apiService from "@/services/apiService";

const url: string = "/exam-template";

export async function getExamTemplate(id: string): Promise<ExamTemplate | any>{
    return (await apiService.api.get(url + "/" + id, {headers: apiService.getHeaders("accessToken")})).data;
}

export async function getExamTemplates(optionalParamters?: OptionalParGeneric): Promise<ExamTemplates | any>{
    return (await apiService.api.get(url, {headers: apiService.getHeaders("accessToken"), params: {optionalParamters}})).data;
}