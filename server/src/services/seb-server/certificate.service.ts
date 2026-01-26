import * as apiService from "./api.service";
import * as constants from "../../utils/constants";


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
