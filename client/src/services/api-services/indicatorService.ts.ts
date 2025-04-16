import * as apiService from "@/services/api-services/apiService";

const url: string = "/indicator";

export async function getIndicators(examId: string): Promise<Indicators | any>{
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {examId}})).data;
}
