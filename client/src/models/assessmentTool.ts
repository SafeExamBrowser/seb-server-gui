import { z } from "zod";
import {
    zLmsSetup,
    zLmsSetupTestResult,
    zPageLmsSetup,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";

// The generated id / institutionId are optional (server-assigned on create); promote
// them to required app values via a codec (keeps the wire input optional so decode stays
// type-safe) instead of .unwrap().
const requiredId = z.codec(zLmsSetup.shape.id, z.int(), {
    decode: (id) => {
        if (id === undefined) {
            throw new Error("Assessment tool response is missing its id");
        }
        return id;
    },
    encode: (id) => id,
});

const requiredInstitutionId = z.codec(zLmsSetup.shape.institutionId, z.int(), {
    decode: (institutionId) => {
        if (institutionId === undefined) {
            throw new Error(
                "Assessment tool response is missing its institution id",
            );
        }
        return institutionId;
    },
    encode: (institutionId) => institutionId,
});

// Read model: keep the fields the app uses. `updateTime` is an epoch millis audit value;
// `connectionId`/`integrationActive` are server-managed. The write-only secrets are read
// back as hash-presence indicators.
export const assessmentToolSchema = zLmsSetup
    .pick({
        name: true,
        lmsType: true,
        lmsClientname: true,
        lmsClientsecret: true,
        lmsUrl: true,
        lmsRestApiToken: true,
        lmsProxyHost: true,
        lmsProxyPort: true,
        lmsProxyAuthUsername: true,
        lmsProxyAuthSecret: true,
        active: true,
        updateTime: true,
        connectionId: true,
        integrationActive: true,
    })
    .extend({
        id: requiredId,
        institutionId: requiredInstitutionId,
    });
export type AssessmentTool = z.infer<typeof assessmentToolSchema>;

export const assessmentToolPageSchema = zPageLmsSetup
    .pick({
        number_of_pages: true,
        page_number: true,
        page_size: true,
        sort: true,
    })
    .extend({
        content: z.array(assessmentToolSchema).optional(),
    });
export type AssessmentToolPage = z.infer<typeof assessmentToolPageSchema>;

// Create/edit body is the LmsSetup entity (T == M). Pick the writable fields;
// server-managed id/active/updateTime/connectionId are assigned server-side and excluded
// from create. institutionId is optional on the wire but the form provides it.
export const assessmentToolCreateSchema = zLmsSetup.pick({
    institutionId: true,
    name: true,
    lmsType: true,
    lmsUrl: true,
    lmsClientname: true,
    lmsClientsecret: true,
    lmsRestApiToken: true,
    lmsProxyHost: true,
    lmsProxyPort: true,
    lmsProxyAuthUsername: true,
    lmsProxyAuthSecret: true,
});
export type AssessmentToolCreateRequest = z.infer<
    typeof assessmentToolCreateSchema
>;

// Derived from the generated enum so the value set can't drift from the backend.
export const LMS_TYPES = assessmentToolCreateSchema.shape.lmsType.options;

// Edit is a JSON PUT of the full entity: the create body plus the persisted id and
// the institution it belongs to.
export const assessmentToolEditSchema = assessmentToolCreateSchema.extend({
    id: z.int(),
    institutionId: z.int(),
});
export type AssessmentToolEditRequest = z.infer<
    typeof assessmentToolEditSchema
>;

export const assessmentToolTestResultSchema = zLmsSetupTestResult;
export type AssessmentToolTestResult = z.infer<
    typeof assessmentToolTestResultSchema
>;
