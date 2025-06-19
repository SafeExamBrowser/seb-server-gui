import * as apiService from "@/services/apiService";

const url: string = "/institution";

export async function getInstitutions(): Promise<Institution[]> {
    return (await apiService.api.get(url)).data;
}

export async function getInstitution(institutionId: string): Promise<Institution  | any>{
    return (await apiService.api.get(url, { params: {institutionId}})).data;
}

export async function getInstitutionLogo(institutionSuffix: string): Promise<Indicators | any>{
    return (await apiService.api.get(url, { params: {institutionSuffix}})).data;
}
