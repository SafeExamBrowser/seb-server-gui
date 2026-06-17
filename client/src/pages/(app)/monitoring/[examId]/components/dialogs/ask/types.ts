import { AppSignatureKeysWithGrantValues } from "@/models/seb-server/appSignatureKey.ts";
import { SebClientConnection } from "@/models/seb-server/clientConnectionList.ts";

export type AskConnectionEntry = {
    id: number;
    name: string;
    conn: SebClientConnection | undefined;
};

export type EnrichedAsk = AppSignatureKeysWithGrantValues & {
    entries: AskConnectionEntry[];
    sebVersion: string;
    osName: string;
};
