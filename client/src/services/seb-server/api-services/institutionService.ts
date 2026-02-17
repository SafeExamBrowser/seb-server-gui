import * as newApiService from "@/services/newApiService";
import { Institution } from "@/models/seb-server/institution";

const baseUrl = "/info" as const;

export const getInstitutions = async (): Promise<Institution[]> =>
    (await newApiService.getRequest(`${baseUrl}/institution`)).data;

export const getInstitutionLogo = async (
    institutionSuffix: string,
): Promise<string> =>
    (
        await newApiService.getRequest(`${baseUrl}/logo/${institutionSuffix}`, {
            headers: { Accept: "application/json, text/plain, */*" },
        })
    ).data;
