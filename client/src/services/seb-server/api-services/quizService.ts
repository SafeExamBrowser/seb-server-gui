import * as apiService from "@/services/apiService";


export async function getQuizzes(optionalParamters?: OptionalParGetQuizzes): Promise<Quizzes | any>{
    const url: string = "/quiz";
    return (await apiService.api.get(url, {headers: apiService.getHeaders("accessToken"), params: {optionalParamters}})).data;
}