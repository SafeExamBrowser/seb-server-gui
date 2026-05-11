import * as apiService from "@/services/apiService";
import {
    CreateInstitutionPar,
    EditInstitutionPar,
    Institution,
    InstitutionAdmin,
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

const RAW_LOGO_MIME = "image/png";

const decodeLogo = (raw: string | undefined): string | undefined => {
    if (!raw) return undefined;
    return raw.startsWith("data:")
        ? raw
        : `data:${RAW_LOGO_MIME};base64,${raw}`;
};

const encodeLogo = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    if (!url.startsWith("data:")) return url;
    const comma = url.indexOf(",");
    return comma >= 0 ? url.slice(comma + 1) : url;
};

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result);
            const comma = result.indexOf(",");
            resolve(comma >= 0 ? result.slice(comma + 1) : result);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });

const serializeLogo = async (
    logo: File | string | undefined,
): Promise<string | undefined> => {
    if (!logo) return undefined;
    if (logo instanceof File) return fileToBase64(logo);
    return encodeLogo(logo);
};

const decodeAdmin = (i: InstitutionAdmin): InstitutionAdmin => ({
    ...i,
    logoImage: decodeLogo(i.logoImage),
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
        content: response.content.map(decodeAdmin),
    };
};

export const getInstitutionById = async (
    id: number,
): Promise<InstitutionAdmin> => {
    const data = (
        await apiService.getRequest({
            url: `${adminBaseUrl}/${id}`,
            options: { _authType: "seb" },
        })
    ).data as InstitutionAdmin;
    return decodeAdmin(data);
};

export const createInstitution = async (
    institution: CreateInstitutionPar,
): Promise<InstitutionAdmin> => {
    const logoImage = await serializeLogo(institution.logoImage);
    return (
        await apiService.postRequest({
            url: adminBaseUrl,
            data: { ...institution, logoImage },
            options: { _authType: "seb" },
        })
    ).data;
};

export const editInstitution = async (
    institution: EditInstitutionPar,
): Promise<InstitutionAdmin> => {
    const logoImage = await serializeLogo(institution.logoImage);
    return (
        await apiService.putRequest({
            url: adminBaseUrl,
            data: { ...institution, logoImage },
            options: { _authType: "seb" },
        })
    ).data;
};

export const deleteInstitution = async (id: number): Promise<unknown> =>
    (
        await apiService.deleteRequest({
            url: `${adminBaseUrl}/${id}`,
            options: { _authType: "seb" },
        })
    ).data;

export const activateInstitution = async (
    id: number,
): Promise<InstitutionAdmin> =>
    (
        await apiService.postRequest({
            url: `${adminBaseUrl}/${id}/active`,
            options: { _authType: "seb" },
        })
    ).data;

export const deactivateInstitution = async (
    id: number,
): Promise<InstitutionAdmin> =>
    (
        await apiService.postRequest({
            url: `${adminBaseUrl}/${id}/inactive`,
            options: { _authType: "seb" },
        })
    ).data;
