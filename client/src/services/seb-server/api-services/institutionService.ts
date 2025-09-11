import * as apiService from "@/services/apiService";

const url: string = "/institution";
const logoUrl: string = "/info/logo";

export async function getInstitutions(): Promise<Institution[]> {
    return (await apiService.api.get(url)).data;
}

export async function getInstitution(
    institutionId: string,
): Promise<Institution | any> {
    return (await apiService.api.get(url, { params: { institutionId } })).data;
}

export async function getInstitutionLogo(
    institutionSuffix: string,
): Promise<Indicators | any> {
    const url = logoUrl + "/" + institutionSuffix;
    return (await apiService.api.get(url)).data;
}
