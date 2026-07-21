import { getCurrentUserGuiAbilities as getCurrentUserGuiAbilitiesSdk } from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    type GuiAbilities,
    guiAbilitiesSchema,
} from "@/models/guiAbilities.ts";
import { decodeWire } from "@/services/errors/wireCodec.ts";

export const getCurrentUserGuiAbilities = (): Promise<GuiAbilities> =>
    getCurrentUserGuiAbilitiesSdk({ client }).then(({ data }) =>
        decodeWire(guiAbilitiesSchema, data),
    );
