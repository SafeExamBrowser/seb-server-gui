import { z } from "zod";

import {
    zCertificateInfo,
    zPageCertificateInfo,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import { isoDateTimeCodec } from "@/models/codecs.ts";

// Read model: alias is the entity's identifier and required on the wire; the validity
// bounds are date-time strings on the wire, real Dates in the app.
export const certificateSchema = zCertificateInfo
    .pick({
        alias: true,
        certType: true,
    })
    .extend({
        validityFrom: isoDateTimeCodec.optional(),
        validityTo: isoDateTimeCodec.optional(),
    });
export type Certificate = z.infer<typeof certificateSchema>;

export const certificatePageSchema = zPageCertificateInfo
    .pick({
        number_of_pages: true,
        page_number: true,
        page_size: true,
        sort: true,
    })
    .extend({
        content: z.array(certificateSchema).optional(),
    });
export type CertificatePage = z.infer<typeof certificatePageSchema>;

// The import endpoint takes the raw file bytes as the request body; the file name (which
// selects PEM vs PKCS12 on the server) and the optional keystore password travel as headers.
export type CertificateImportRequest = {
    file: File;
    password?: string;
};
