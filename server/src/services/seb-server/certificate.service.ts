import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function getCertificates(token: string, options?: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.get(constants.CERTIFICATE_ROUTE, {headers: apiService.getHeaders(token), params: options});
    return [data, status];
}


export async function deleteCertificate(
    token: string,
    alias: string,
): Promise<[any, number]> {

    const url = constants.CERTIFICATE_ROUTE

    const body = apiService.createUrlEncodedBody({ alias });

    const { data, status } = await apiService.api.delete(url, {
        headers: apiService.getHeaders(token),
        data: body,
    });

    return [data, status];
}



export async function createCertificate(token: string, newCertificate: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.post(constants.LMS_SETUP_ROUTE, apiService.createUrlEncodedBody(newCertificate), {headers: apiService.getHeaders(token)});
    return [data, status];
}

