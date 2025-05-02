import * as apiService from "@/services/apiService";

const url: string = "/indicator";

export async function getIndicators(examId: string): Promise<Indicators | any>{
    return (await apiService.api.get(url, {headers: apiService.getHeaders("accessToken"), params: {examId}})).data;
}
