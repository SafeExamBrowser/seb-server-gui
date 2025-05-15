import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const url: string = "/indicator";

export async function getIndicators(examId: string): Promise<Indicators | any>{
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN), params: {examId}})).data;
}
