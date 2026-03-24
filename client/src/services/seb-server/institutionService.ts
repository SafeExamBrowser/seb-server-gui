import * as apiService from "@/services/apiService";
import { Institution } from "@/models/seb-server/institution";

const baseUrl = "/info" as const;

export const getInstitutions = async (): Promise<Institution[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/institution`,
            options: {
                _authType: "none",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        })
    ).data;

export const getInstitutionLogo = async (
    institutionSuffix: string,
): Promise<string> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/logo/${institutionSuffix}`,
            options: {
                headers: { Accept: "application/json, text/plain, */*" },
            },
        })
    ).data;
