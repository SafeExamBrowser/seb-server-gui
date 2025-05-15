import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";


export async function getAssessmentTools(isActive: string): Promise<AssessmentTools | any>{
    const url: string = "/assessment-tools";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: {isActive}})).data;
}

export async function getAssessmentTool(id: number): Promise<AssessmentTool | any>{
    const url: string = "/get-assessment-tool/" + id;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}