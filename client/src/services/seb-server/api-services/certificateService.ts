import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import {
    Certificate,
    CertificatesResponse,
    CreateCertificateJSON,
    OptionalParGetCertificates,
} from "@/models/seb-server/certificate";

const certificatesURL: string = "/certificate";

export async function getCertificates(
    optionalParameters?: OptionalParGetCertificates,
): Promise<CertificatesResponse> {
    return (
        await apiService.api.get(certificatesURL, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function deleteCertificate(
    certificateId: string,
): Promise<unknown | unknown> {
    return (
        await apiService.api.delete(certificatesURL + "/" + certificateId, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function createCertificate(
    payload: CreateCertificateJSON,
): Promise<Certificate> {
    const { data } = await apiService.api.post(certificatesURL, payload, {
        headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
    });
    return data;
}
