import * as apiService from "@/services/api-services/apiService";

export async function getExamTemplates(optionalParamters?: OptionalParGeneric): Promise<ExamTemplates | any>{
    const url: string = "/exam-template";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}})).data;
}