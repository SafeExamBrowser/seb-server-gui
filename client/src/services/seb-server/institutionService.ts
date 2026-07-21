import {
    activateInstitution as activateInstitutionSdk,
    createInstitution as createInstitutionSdk,
    deactivateInstitution as deactivateInstitutionSdk,
    deleteInstitution as deleteInstitutionSdk,
    editInstitution as editInstitutionSdk,
    getInstitutionById as getInstitutionByIdSdk,
    getInstitutions as getInstitutionsSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import type {
    EntityProcessingReport,
    GetInstitutionsData,
} from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { zEntityProcessingReport } from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    type Institution,
    type InstitutionCreateRequest,
    institutionCreateSchema,
    type InstitutionEditRequest,
    type InstitutionPage,
    institutionPageSchema,
    institutionSchema,
} from "@/models/institution.ts";
import { decodeWire, encodeWire } from "@/services/errors/wireCodec.ts";

const RAW_LOGO_MIME = "image/png";

const detectLogoMime = (base64: string): string => {
    if (base64.startsWith("/9j/")) {
        return "image/jpeg";
    }
    if (base64.startsWith("R0lGOD")) {
        return "image/gif";
    }
    if (base64.startsWith("UklGR")) {
        return "image/webp";
    }
    if (base64.startsWith("PHN2") || base64.startsWith("PD94")) {
        return "image/svg+xml";
    }
    return RAW_LOGO_MIME;
};

const decodeLogo = (raw: string | undefined): string | undefined => {
    if (!raw) {
        return undefined;
    }
    return raw.startsWith("data:")
        ? raw
        : `data:${detectLogoMime(raw)};base64,${raw}`;
};

const encodeLogo = (url: string | undefined): string | undefined => {
    if (!url) {
        return undefined;
    }
    if (!url.startsWith("data:")) {
        return url;
    }
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
    if (logo === undefined) {
        return undefined;
    }
    if (logo instanceof File) {
        return fileToBase64(logo);
    }
    if (logo === "") {
        return "";
    }
    return encodeLogo(logo);
};

const withDecodedLogo = (
    institution: Institution,
    wireLogo: string | undefined,
): Institution => ({ ...institution, logoImage: decodeLogo(wireLogo) });

export const getInstitutions = (
    query?: GetInstitutionsData["query"],
): Promise<InstitutionPage> =>
    getInstitutionsSdk({ client, query }).then(({ data }) => {
        const page = decodeWire(institutionPageSchema, data);
        return {
            ...page,
            content: page.content?.map((row, index) =>
                withDecodedLogo(row, data?.content?.[index]?.logoImage),
            ),
        };
    });

export const getInstitutionById = (modelId: string): Promise<Institution> =>
    getInstitutionByIdSdk({ client, path: { modelId } }).then(({ data }) =>
        withDecodedLogo(decodeWire(institutionSchema, data), data?.logoImage),
    );

export const createInstitution = async (
    body: InstitutionCreateRequest,
): Promise<Institution> => {
    const logoImage = await serializeLogo(body.logoImage);
    const { data } = await createInstitutionSdk({
        client,
        body: { ...encodeWire(institutionCreateSchema, body), logoImage },
    });
    return withDecodedLogo(
        decodeWire(institutionSchema, data),
        data?.logoImage,
    );
};

export const editInstitution = async (
    body: InstitutionEditRequest,
): Promise<Institution> => {
    const logoImage = await serializeLogo(body.logoImage);
    const { data } = await editInstitutionSdk({
        client,
        body: { ...encodeWire(institutionSchema, body), logoImage },
    });
    return withDecodedLogo(
        decodeWire(institutionSchema, data),
        data?.logoImage,
    );
};

export const deleteInstitution = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deleteInstitutionSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );

export const activateInstitution = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    activateInstitutionSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );

export const deactivateInstitution = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deactivateInstitutionSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );
