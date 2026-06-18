import * as apiService from "@/services/apiService";
import { decodeWire } from "@/services/errors/wireCodec.ts";
import {
    institutionNameSchema,
    type InstitutionName,
} from "@/models/institution.ts";

// /info/* is on the unmigrated InfoController and backs the PUBLIC register
// dropdown, so it stays on the legacy apiService (reachable unauthenticated).
const infoBaseUrl = "/info" as const;

export const getInstitutions = async (): Promise<InstitutionName[]> => {
    const { data } = await apiService.getRequest({
        url: `${infoBaseUrl}/institution`,
        options: {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        },
    });
    return (data ?? []).map((row: InstitutionName) =>
        decodeWire(institutionNameSchema, row),
    );
};
