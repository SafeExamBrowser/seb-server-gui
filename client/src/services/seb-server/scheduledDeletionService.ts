import {
    ScheduledDelete,
    ScheduledDeleteReport,
    ScheduledDeletions,
} from "@/models/seb-server/scheduled-deletion";
import * as apiService from "@/services/apiService";
import { BasicListParams } from "@/services/types";
import { normaliseBasicListParams } from "@/utils/table/tableUtils";

const baseUrl = "/scheduled-delete" as const;

export const getScheduledDeletions = async ({
    basicListParams,
    dueTimestamp,
    state,
}: {
    basicListParams?: BasicListParams;
    dueTimestamp?: number;
    state?: string;
}): Promise<ScheduledDeletions> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: {
                _authType: "seb",
                params: {
                    ...normaliseBasicListParams(basicListParams),
                    dueTimestamp,
                    state,
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

export const createScheduledDelete = async (body: {
    deleteDueTime: number;
}): Promise<ScheduledDelete> =>
    (
        await apiService.postRequest({
            url: baseUrl,
            data: body,
            options: { _authType: "seb" },
        })
    ).data;

export const getScheduledDeletionReport = async (
    id: number,
): Promise<ScheduledDeleteReport> =>
    (
        await apiService.getRequest({
            url: baseUrl + "/" + id,
            options: {
                _authType: "seb",
            },
        })
    ).data;

export const excludeFromDeletion = async (
    id: number,
    exclude: boolean,
): Promise<ScheduledDeleteReport> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${id}/${exclude ? "mark-exclude" : "unmark-exclude"}`,
            options: { _authType: "seb" },
        })
    ).data;
