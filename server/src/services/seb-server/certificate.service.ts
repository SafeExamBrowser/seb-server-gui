import * as apiService from "./api.service";
import * as constants from "../../utils/constants";
import {getOctetStreamHeadersAcceptJson} from "./api.service";

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


type CreateCertificateBody = {
    fileBase64: string;
    fileName: string;
    alias?: string;
    password?: string;
};

export async function createCertificate(
    token: string,
    body: CreateCertificateBody
): Promise<[object, number]> {
    const binary = Buffer.from(body.fileBase64, 'base64');

    const IMPORT_FILE_ATTR_NAME = 'importFile'
    const IMPORT_PASSWORD_ATTR_NAME = 'importFilePassword'

    const headers: any = {
        ...apiService.getOctetStreamHeadersAcceptJson(token),
        [IMPORT_FILE_ATTR_NAME]: body.fileName,
    };
    if (body.password) headers[IMPORT_PASSWORD_ATTR_NAME] = body.password;

    const { data, status } = await apiService.api.post(
        constants.CERTIFICATE_ROUTE,
        binary,
        {
            headers,
            maxBodyLength: Infinity,
        }
    );

    return [data, status];
}
