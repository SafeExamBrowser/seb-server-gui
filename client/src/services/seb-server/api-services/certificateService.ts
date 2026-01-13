import * as apiService from "@/services/apiService";
import * as newApiService from "@/services/newApiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import {
    Certificate,
    CertificatesResponse,
    CreateCertificateJSON,
    OptionalParGetCertificates,
} from "@/models/seb-server/certificate";

const baseUrl = "/certificate" as const;

export const getCertificates = async (
    optionalParameters?: OptionalParGetCertificates,
): Promise<CertificatesResponse> =>
    (await newApiService.get(baseUrl, { params: optionalParameters })).data;

export async function deleteCertificate(
    certificateId: string,
): Promise<unknown | unknown> {
    return (
        await apiService.api.delete(baseUrl + "/" + certificateId, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function createCertificate(
    payload: CreateCertificateJSON,
): Promise<Certificate> {
    const { data } = await apiService.api.post(baseUrl, payload, {
        headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
    });
    return data;
}
