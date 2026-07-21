import { z } from "zod";

import {
    zEntityName,
    zInstitution,
    zPageInstitution,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";

// T == M (ActivatableEntityController<Institution, Institution>): no zInstitutionMod.
// id is optional on the wire (omitted on create) but required on a persisted
// entity, so the codec keeps the input optional and promotes it on decode.
const requiredId = z.codec(zInstitution.shape.id, z.int(), {
    decode: (id) => {
        if (id === undefined) {
            throw new Error("Institution response is missing its id");
        }
        return id;
    },
    encode: (id) => id,
});

// logoImage is wire base64 but a File/data-URL in the app, so it stays out of
// the schemas and institutionService converts it (a File encode can't be a codec).
export const institutionSchema = zInstitution
    .pick({ name: true, urlSuffix: true, active: true })
    .extend({ id: requiredId });
export type Institution = z.infer<typeof institutionSchema> & {
    logoImage?: string;
};

// Create body: writable fields only (id/active are server-managed).
export const institutionCreateSchema = zInstitution.pick({
    name: true,
    urlSuffix: true,
});
export type InstitutionCreateRequest = z.infer<
    typeof institutionCreateSchema
> & {
    logoImage?: File | string;
};

export type InstitutionEditRequest = z.infer<typeof institutionSchema> & {
    logoImage?: File | string;
};

// Paged admin list; institutionService adds each row's logoImage (see above).
export const institutionPageSchema = zPageInstitution
    .pick({
        number_of_pages: true,
        page_number: true,
        page_size: true,
        sort: true,
    })
    .extend({ content: z.array(institutionSchema).optional() });
export type InstitutionPage = z.infer<typeof institutionPageSchema> & {
    content?: Institution[];
};

// Lookup/dropdown shape (EntityName) for the institution name endpoints.
export const institutionNameSchema = zEntityName.pick({
    modelId: true,
    name: true,
});
export type InstitutionName = z.infer<typeof institutionNameSchema>;
