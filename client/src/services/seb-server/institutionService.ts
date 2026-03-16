import * as apiService from "@/services/apiService";
import { Institution } from "@/models/seb-server/institution";

const baseUrl = "/info" as const;

export const getInstitutions = async (): Promise<Institution[]> =>
    (
        await apiService.getRequest(
            `${baseUrl}/institution`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
            false,
        )
    ).data;

export const getInstitutionLogo = async (
    institutionSuffix: string,
): Promise<string> =>
    (
        await apiService.getRequest(`${baseUrl}/logo/${institutionSuffix}`, {
            headers: { Accept: "application/json, text/plain, */*" },
        })
    ).data;
