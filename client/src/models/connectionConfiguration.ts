import { z } from "zod";

import {
    zPageSebClientConfig,
    zSebClientConfig,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import { isoDateTimeCodec } from "@/models/codecs.ts";

// The generated id / institutionId are optional (server-assigned on create); promote
// them to required app values via a codec (keeps the wire input optional so decode stays
// type-safe) instead of .unwrap().
const requiredId = z.codec(zSebClientConfig.shape.id, z.int(), {
    decode: (id) => {
        if (id === undefined) {
            throw new Error(
                "Connection configuration response is missing its id",
            );
        }
        return id;
    },
    encode: (id) => id,
});

const requiredInstitutionId = z.codec(
    zSebClientConfig.shape.institutionId,
    z.int(),
    {
        decode: (institutionId) => {
            if (institutionId === undefined) {
                throw new Error(
                    "Connection configuration response is missing its institution id",
                );
            }
            return institutionId;
        },
        encode: (institutionId) => institutionId,
    },
);

// Read model: keep the fields the app uses, drop the write-only password/secret fields
// and the fat extras. `date` is the creation timestamp shown in the list; `lastUpdateTime`
// is audit info on the edit page — both are date-time strings on the wire, real Dates in the app.
export const connectionConfigurationSchema = zSebClientConfig
    .pick({
        name: true,
        sebConfigPurpose: true,
        sebServerPingTime: true,
        vdiSetup: true,
        sebServerFallback: true,
        startURL: true,
        sebServerFallbackTimeout: true,
        sebServerFallbackAttempts: true,
        sebServerFallbackAttemptInterval: true,
        cert_alias: true,
        cert_encryption_asym: true,
        active: true,
        lastUpdateUser: true,
    })
    .extend({
        id: requiredId,
        institutionId: requiredInstitutionId,
        date: isoDateTimeCodec.optional(),
        lastUpdateTime: isoDateTimeCodec.optional(),
    });
export type ConnectionConfiguration = z.infer<
    typeof connectionConfigurationSchema
>;

export const connectionConfigurationPageSchema = zPageSebClientConfig
    .pick({
        number_of_pages: true,
        page_number: true,
        page_size: true,
        sort: true,
    })
    .extend({
        content: z.array(connectionConfigurationSchema).optional(),
    });
export type ConnectionConfigurationPage = z.infer<
    typeof connectionConfigurationPageSchema
>;

// Create/edit body is the SebClientConfig entity (T == M). Pick the writable fields;
// server-managed id/institutionId/active/lastUpdate*/date are assigned server-side and
// excluded from create. The password/secret fields are written as plain strings.
export const connectionConfigurationCreateSchema = zSebClientConfig.pick({
    name: true,
    sebConfigPurpose: true,
    sebServerPingTime: true,
    vdiSetup: true,
    cert_alias: true,
    cert_encryption_asym: true,
    sebServerFallback: true,
    startURL: true,
    sebServerFallbackTimeout: true,
    sebServerFallbackAttempts: true,
    sebServerFallbackAttemptInterval: true,
    exam_selection: true,
    encryptSecret: true,
    confirm_encrypt_secret: true,
    sebServerFallbackPasswordHash: true,
    sebServerFallbackPasswordHashConfirm: true,
    hashedQuitPassword: true,
    hashedQuitPasswordConfirm: true,
});
export type ConnectionConfigurationCreateRequest = z.infer<
    typeof connectionConfigurationCreateSchema
>;

// Derived from the generated enum so the value set can't drift from the backend.
export const SEB_CONFIG_PURPOSES =
    connectionConfigurationCreateSchema.shape.sebConfigPurpose.options;

// Edit is a JSON PUT of the full entity: the create body plus the persisted id and
// the institution it belongs to.
export const connectionConfigurationEditSchema =
    connectionConfigurationCreateSchema.extend({
        id: z.int(),
        institutionId: z.int(),
    });
export type ConnectionConfigurationEditRequest = z.infer<
    typeof connectionConfigurationEditSchema
>;
