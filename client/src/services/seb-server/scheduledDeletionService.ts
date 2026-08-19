import {
    createScheduledDelete as createScheduledDeleteSdk,
    deleteScheduledDelete as deleteScheduledDeleteSdk,
    getScheduledDeleteReport as getScheduledDeleteReportSdk,
    getScheduledDeletes as getScheduledDeletesSdk,
    markExcludeFromDeletion as markExcludeFromDeletionSdk,
    unmarkExcludeFromDeletion as unmarkExcludeFromDeletionSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import type { GetScheduledDeletesData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    type ScheduledDeletePage,
    scheduledDeletePageSchema,
    type ScheduledDeleteReport,
    scheduledDeleteReportSchema,
} from "@/models/scheduledDeletion.ts";
import { decodeWire } from "@/services/errors/wireCodec.ts";

export const getScheduledDeletes = (
    query?: GetScheduledDeletesData["query"],
): Promise<ScheduledDeletePage> =>
    getScheduledDeletesSdk({ client, query }).then(({ data }) =>
        decodeWire(scheduledDeletePageSchema, data),
    );

export const getScheduledDeleteReport = (
    modelId: string,
): Promise<ScheduledDeleteReport> =>
    getScheduledDeleteReportSdk({ client, path: { modelId } }).then(
        ({ data }) => decodeWire(scheduledDeleteReportSchema, data),
    );

export const createScheduledDelete = (
    deleteDueTime: number,
): Promise<ScheduledDeleteReport> =>
    createScheduledDeleteSdk({ client, body: { deleteDueTime } }).then(
        ({ data }) => decodeWire(scheduledDeleteReportSchema, data),
    );

export const deleteScheduledDelete = async (modelId: string): Promise<void> => {
    await deleteScheduledDeleteSdk({ client, path: { modelId } });
};

// The response carries the recalculated pending deletion report, or an empty
// body when no deletion is pending; no consumer needs it, so it is ignored.
export const setExamExcludedFromDeletion = async (
    examId: number,
    exclude: boolean,
): Promise<void> => {
    const path = { modelId: String(examId) };
    if (exclude) {
        await markExcludeFromDeletionSdk({ client, path });
        return;
    }
    await unmarkExcludeFromDeletionSdk({ client, path });
};
