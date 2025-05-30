import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const url: string = "/institution";

const mockInstitutions: Institution[] = [
    {
        id: "1",
        entityType: "INSTITUTION",
        name: "SEB Server"
    },
    {
        id: "2",
        entityType: "INSTITUTION",
        name: "ETH"
    },
    {
        id: "3",
        entityType: "INSTITUTION",
        name: "UZH"
    },
    {
        id: "4",
        entityType: "INSTITUTION",
        name: "New institution"
    }
];

export async function getInstitutions(): Promise<Institution[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockInstitutions), 200));
}

export async function getInstitutionss(): Promise<Institution[]> {
    return (await apiService.api.get(url)).data;
}


export async function getInstitution(institutionId: string): Promise<Institution  | any>{
    return (await apiService.api.get(url, { params: {institutionId}})).data;
}

export async function getInstitutionLogo(institutionSuffix: string): Promise<Indicators | any>{
    return (await apiService.api.get(url, { params: {institutionSuffix}})).data;
}
