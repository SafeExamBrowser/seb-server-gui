import * as newApiService from "@/services/newApiService";
import {
    Certificate,
    CertificatesResponse,
    CreateCertificatePar,
    OptionalParGetCertificates,
} from "@/models/seb-server/certificate";

const baseUrl = "/certificate" as const;

export const getCertificates = async (
    optionalParameters?: OptionalParGetCertificates,
): Promise<CertificatesResponse> =>
    (await newApiService.get(baseUrl, { params: optionalParameters })).data;

export const deleteCertificate = async (
    certificateId: string,
): Promise<unknown | unknown> =>
    (await newApiService.deleteRequest(`${baseUrl}`, { alias: certificateId }))
        .data;

export const createCertificate = async (
    certificate: CreateCertificatePar,
): Promise<Certificate> =>
    (
        await newApiService.post(baseUrl, certificate.file, {
            headers: {
                "Content-Type": "application/octet-stream",
                importFile: certificate.fileName,
                ...(certificate.password
                    ? { importFilePassword: certificate.password }
                    : {}),
            },
        })
    ).data;
