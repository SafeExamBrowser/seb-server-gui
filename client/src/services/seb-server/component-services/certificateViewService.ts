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

export async function createCertificate(certificate: CreateCertificatePar) {
    try {
        return await certificateService.createCertificate(certificate);
    } catch {
        return null;
    }
}
