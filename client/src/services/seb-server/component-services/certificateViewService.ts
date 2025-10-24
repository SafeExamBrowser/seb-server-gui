import * as certificateService from "@/services/seb-server/api-services/certificateService";
import {
    CertificatesResponse,
    CreateCertificatePar,
    OptionalParGetCertificates,
} from "@/models/seb-server/certificate";

export async function getCertificates(
    optionalParameters?: OptionalParGetCertificates,
): Promise<CertificatesResponse | null> {
    try {
        return await certificateService.getCertificates(optionalParameters);
    } catch {
        return null;
    }
}

export async function deleteCertificate(
    certificateId: string,
): Promise<undefined | null> {
    try {
        await certificateService.deleteCertificate(certificateId);
        return undefined;
    } catch {
        return null;
    }
}

export async function createCertificate(params: CreateCertificatePar) {
    try {
        const fileBase64 = await blobToBase64(params.file);
        return await certificateService.createCertificate({
            fileBase64,
            fileName: params.fileName,
            password: params.password,
        });
    } catch {
        return null;
    }
}

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.onload = () => {
            const result = String(reader.result ?? "");
            const comma = result.indexOf(",");
            resolve(comma >= 0 ? result.slice(comma + 1) : result);
        };
        reader.readAsDataURL(blob);
    });
}
