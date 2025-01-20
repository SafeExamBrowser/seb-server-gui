import * as apiService from "@/services/api-services/apiService";


export async function getQuizzes(optionalParamters?: OptionalParGeneric): Promise<Quizzes | any>{
    const url: string = "/quiz";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}})).data;
}