import * as apiService from "@/services/apiService";
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
    (
        await apiService.getRequest({
            url: baseUrl,
            options: { _authType: "seb", params: optionalParameters },
        })
    ).data;

export const deleteCertificate = async (
    certificateId: string,
): Promise<unknown | unknown> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}`,
            data: { alias: certificateId },
            options: { _authType: "seb" },
        })
    ).data;

export const createCertificate = async (
    certificate: CreateCertificatePar,
): Promise<Certificate> =>
    (
        await apiService.postRequest({
            url: baseUrl,
            data: certificate.file,
            options: {
                _authType: "seb",
                headers: {
                    "Content-Type": "application/octet-stream",
                    importFile: certificate.fileName,
                    ...(certificate.password
                        ? { importFilePassword: certificate.password }
                        : {}),
                },
            },
        })
    ).data;
