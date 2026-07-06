import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    deleteCertificate as deleteCertificateSdk,
    getCertificates as getCertificatesSdk,
    importCertificate as importCertificateSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import {
    certificatePageSchema,
    certificateSchema,
    type Certificate,
    type CertificateImportRequest,
    type CertificatePage,
} from "@/models/certificate.ts";
import { decodeWire } from "@/services/errors/wireCodec.ts";
import { zDeleteCertificateResponse } from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import type {
    EntityKey,
    GetCertificatesData,
} from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const getCertificates = (
    query?: GetCertificatesData["query"],
): Promise<CertificatePage> =>
    getCertificatesSdk({ client, query }).then(({ data }) =>
        decodeWire(certificatePageSchema, data),
    );

export const importCertificate = (
    request: CertificateImportRequest,
): Promise<Certificate> =>
    importCertificateSdk({
        client,
        body: request.file,
        headers: {
            importFile: request.file.name,
            importFilePassword: request.password,
        },
    }).then(({ data }) => decodeWire(certificateSchema, data));

// The backend deletes per alias and skips failures (e.g. a certificate still referenced by
// a connection configuration), answering 200 with only the keys it actually removed — so a
// missing key means the delete did not happen and must surface as an error.
export const deleteCertificate = (alias: string): Promise<EntityKey[]> =>
    deleteCertificateSdk({ client, body: { alias } }).then(({ data }) => {
        const deletedKeys = decodeWire(zDeleteCertificateResponse, data);
        if (!deletedKeys.some((key) => key.modelId === alias)) {
            throw new Error(`Certificate "${alias}" was not deleted`);
        }
        return deletedKeys;
    });
