import * as apiService from "@/services/api-services/apiService";



export async function getAssessmentTools(isActive: string): Promise<AssessmentTools | any>{
    const url: string = "/assessment-tools";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {isActive}})).data;
}

export async function getAssessmentTool(id: number): Promise<AssessmentTool | any>{
    const url: string = "/get-assessment-tool/" + id;
    return (await apiService.api.get(url, {headers: apiService.getHeaders()})).data;
}