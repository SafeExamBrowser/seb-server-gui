import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const url: string = "/exam-template";

export async function getExamTemplate(id: string): Promise<ExamTemplate | any>{
    return (await apiService.api.get(url + "/" + id, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function getExamTemplates(optionalParameters?: OptionalParGeneric): Promise<ExamTemplates | any>{
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: {optionalParameters}})).data;
}

export async function getExamTemplateSp(id: string): Promise<ScreenProctoringSettings | any>{
    return (await apiService.api.get(url + "/" + id + "/screen-proctoring", {headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN)})).data;
}