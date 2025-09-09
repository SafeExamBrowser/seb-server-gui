import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const certificatesURL: string = "/certificate";

export async function getCertificates(
    optionalParameters?: OptionalParGetCertificates,
): Promise<CertificatesResponse[] | any> {
    const url: string = certificatesURL;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function deleteCertificate(
    certificateId: string,
): Promise<any | any> {
    return (
        await apiService.api.delete(certificatesURL + "/" + certificateId, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function createCertificate(
    payload: CreateCertificateJSON,
): Promise<any> {
    const { data } = await apiService.api.post(certificatesURL, payload, {
        headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
    });
    return data;
}
