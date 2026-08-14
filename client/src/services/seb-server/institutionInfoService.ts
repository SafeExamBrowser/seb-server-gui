import { getInstitutionInfo as getInstitutionInfoSdk } from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    type InstitutionName,
    institutionNameSchema,
} from "@/models/institution.ts";
import { decodeWire } from "@/services/errors/wireCodec.ts";

// Publicly reachable (listed in PUBLIC_PATHS): it backs the institution
// dropdown of the unauthenticated register page.
export const getInstitutions = (): Promise<InstitutionName[]> =>
    getInstitutionInfoSdk({ client }).then(({ data }) =>
        (data ?? []).map((name) => decodeWire(institutionNameSchema, name)),
    );
