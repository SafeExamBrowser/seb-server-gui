import * as apiService from "@/services/apiService";
import {
    CreateInstitutionPar,
    EditInstitutionPar,
    Institution,
    InstitutionResponse,
} from "@/models/seb-server/institution";
import { BasicListParams } from "@/services/types";
import { normaliseBasicListParams } from "@/utils/table/tableUtils";

const infoBaseUrl = "/info" as const;
const adminBaseUrl = "/institution" as const;

export const getInstitutions = async (): Promise<Institution[]> =>
    (
        await apiService.getRequest({
            url: `${infoBaseUrl}/institution`,
            options: {
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
            url: `${infoBaseUrl}/logo/${institutionSuffix}`,
            options: {
                _authType: "seb",
                headers: { Accept: "application/json, text/plain, */*" },
            },
        })
    ).data;

const normalizeInstitution = (i: Institution): Institution => ({
    ...i,
    modelId: i.modelId ?? (i.id != null ? String(i.id) : ""),
});

export const getInstitutionsAdmin = async ({
    basicListParams,
    name,
    active,
}: {
    basicListParams?: BasicListParams;
    name?: string;
    active?: string;
}): Promise<InstitutionResponse> => {
    const response = (
        await apiService.getRequest({
            url: adminBaseUrl,
            options: {
                _authType: "seb",
                params: {
                    ...normaliseBasicListParams(basicListParams),
                    name,
                    active,
                },
            },
        })
    ).data as InstitutionResponse;

    return {
        ...response,
        content: response.content.map(normalizeInstitution),
    };
};

export const getInstitutionById = async (
    modelId: string,
): Promise<Institution> => {
    const data = (
        await apiService.getRequest({
            url: `${adminBaseUrl}/${modelId}`,
            options: { _authType: "seb" },
        })
    ).data as Institution;
    return normalizeInstitution(data);
};

export const createInstitution = async (
    institution: CreateInstitutionPar,
): Promise<Institution> =>
    (
        await apiService.postRequest({
            url: adminBaseUrl,
            data: institution,
            options: { _authType: "seb" },
        })
    ).data;

export const editInstitution = async (
    institution: EditInstitutionPar,
): Promise<Institution> =>
    (
        await apiService.putRequest({
            url: adminBaseUrl,
            data: institution,
            options: { _authType: "seb" },
        })
    ).data;

export const deleteInstitution = async (modelId: string): Promise<unknown> =>
    (
        await apiService.deleteRequest({
            url: `${adminBaseUrl}/${modelId}`,
            options: { _authType: "seb" },
        })
    ).data;

export const activateInstitution = async (
    modelId: string,
): Promise<Institution> =>
    (
        await apiService.postRequest({
            url: `${adminBaseUrl}/${modelId}/active`,
            options: { _authType: "seb" },
        })
    ).data;

export const deactivateInstitution = async (
    modelId: string,
): Promise<Institution> =>
    (
        await apiService.postRequest({
            url: `${adminBaseUrl}/${modelId}/inactive`,
            options: { _authType: "seb" },
        })
    ).data;
