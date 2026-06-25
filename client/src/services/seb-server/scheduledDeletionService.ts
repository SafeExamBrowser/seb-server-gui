import * as apiService from "@/services/apiService";
import { normaliseBasicListParams } from "@/utils/table/tableUtils";
import { ScheduledDeletions } from "@/models/seb-server/sheduled-deletion";
import { BasicListParams } from "@/services/types";

const baseUrl = "/scheduled-delete" as const;

export const getScheduledDeletions = async ({
    basicListParams,
    dueTimestamp,
    status,
}: {
    basicListParams?: BasicListParams;
    dueTimestamp?: number;
    status?: string;
}): Promise<ScheduledDeletions> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: {
                _authType: "seb",
                params: {
                    ...normaliseBasicListParams(basicListParams),
                    dueTimestamp,
                    status,
                },
            },
        })
    ).data;

export const deleteScheduledDeletion = async (id: number): Promise<void> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}/${id}`,
            options: { _authType: "seb" },
        })
    ).data;
