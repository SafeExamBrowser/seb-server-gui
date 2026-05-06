import { z } from "zod";

export type CertificateUploadItemTransient = {
    file?: File;
    password?: string;
};

const certificateUploadItemSchema = z.object({
    file: z.instanceof(File),
    password: z
        .string()
        .optional()
        .transform((value) => (value === "" ? undefined : value)),
});

export type CertificateUploadItem = z.infer<typeof certificateUploadItemSchema>;

export const toCertificateUploadItem = (
    itemTransient: CertificateUploadItemTransient,
): CertificateUploadItem => certificateUploadItemSchema.parse(itemTransient);

export type CertKey = {
    id: string;
    name: string;
};
