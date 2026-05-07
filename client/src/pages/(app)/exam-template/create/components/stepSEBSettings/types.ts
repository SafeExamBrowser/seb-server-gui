import { z } from "zod";

export type SEBSettingsImportItemTransient = {
    file?: File;
    password?: string;
    quitPassword?: string;
};

const sebSettingsImportItemSchema = z.object({
    file: z.instanceof(File),
    password: z
        .string()
        .optional()
        .transform((value) => (value === "" ? undefined : value)),
    quitPassword: z
        .string()
        .optional()
        .transform((value) => (value === "" ? undefined : value)),
});

export type SEBSettingsImportItem = z.infer<typeof sebSettingsImportItemSchema>;

export const toCSEBSettingsImportItem = (
    itemTransient: SEBSettingsImportItemTransient,
): SEBSettingsImportItem => sebSettingsImportItemSchema.parse(itemTransient);
