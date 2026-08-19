import { z } from "zod";

import {
    zGroupInfo,
    zPageScheduledDelete,
    zScheduledDelete,
    zScheduledDeleteReport,
    zScheduledDeleteViewInfo,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import { TableItem } from "@/components/widgets/entity-table/types";

export enum ScheduledDeleteStatusEnum {
    PENDING = "PENDING",
    SPS_RUNNING = "SPS_RUNNING",
    RUNNING = "RUNNING",
    FINISHED = "FINISHED",
}

export const scheduledDeleteStatusColor: Record<
    ScheduledDeleteStatusEnum,
    string
> = {
    [ScheduledDeleteStatusEnum.PENDING]: "blue",
    [ScheduledDeleteStatusEnum.SPS_RUNNING]: "red",
    [ScheduledDeleteStatusEnum.RUNNING]: "red",
    [ScheduledDeleteStatusEnum.FINISHED]: "green",
};

type WireScheduledDeleteState = z.infer<typeof zScheduledDelete.shape.state>;

const STATE_FROM_WIRE: Record<
    WireScheduledDeleteState,
    ScheduledDeleteStatusEnum
> = {
    PENDING: ScheduledDeleteStatusEnum.PENDING,
    SPS_RUNNING: ScheduledDeleteStatusEnum.SPS_RUNNING,
    RUNNING: ScheduledDeleteStatusEnum.RUNNING,
    FINISHED: ScheduledDeleteStatusEnum.FINISHED,
};

const STATE_TO_WIRE: Record<
    ScheduledDeleteStatusEnum,
    WireScheduledDeleteState
> = {
    [ScheduledDeleteStatusEnum.PENDING]: "PENDING",
    [ScheduledDeleteStatusEnum.SPS_RUNNING]: "SPS_RUNNING",
    [ScheduledDeleteStatusEnum.RUNNING]: "RUNNING",
    [ScheduledDeleteStatusEnum.FINISHED]: "FINISHED",
};

const stateCodec = z.codec(
    zScheduledDelete.shape.state,
    z.enum(ScheduledDeleteStatusEnum),
    {
        decode: (state) => STATE_FROM_WIRE[state],
        encode: (state) => STATE_TO_WIRE[state],
    },
);

export const toWireScheduledDeleteState = (
    value?: string,
): WireScheduledDeleteState | undefined => {
    const state = Object.values(ScheduledDeleteStatusEnum).find(
        (candidate) => candidate === value,
    );
    return state === undefined ? undefined : STATE_TO_WIRE[state];
};

export const scheduledDeleteSchema = zScheduledDelete
    .pick({
        id: true,
        deleteDueTime: true,
        scheduleTime: true,
        startTime: true,
        endTime: true,
    })
    .extend({
        state: stateCodec,
    });

export type ScheduledDelete = z.infer<typeof scheduledDeleteSchema>;

export type ScheduledDeleteItem = ScheduledDelete;

// TODO @andrei: this type guard can be removed, once the EntityTable uses a generic type for the item
export const isScheduledDeleteItem = (
    item: TableItem,
): item is ScheduledDeleteItem => typeof item.id === "number";

export const scheduledDeletePageSchema = zPageScheduledDelete
    .pick({
        number_of_pages: true,
        page_number: true,
        page_size: true,
    })
    .extend({
        content: z.array(scheduledDeleteSchema).optional(),
    });

export type ScheduledDeletePage = z.infer<typeof scheduledDeletePageSchema>;

export const spsGroupInfoSchema = zGroupInfo.pick({
    groupName: true,
    numberOfSessions: true,
});

export type SPSGroupInfo = z.infer<typeof spsGroupInfoSchema>;

const examStartTimeCodec = z.codec(
    zScheduledDeleteViewInfo.shape.examStartTime,
    z.int(),
    {
        decode: (examStartTime) => examStartTime ?? 0,
        encode: (examStartTime) => examStartTime,
    },
);

export const deletionInfoSchema = zScheduledDeleteViewInfo
    .pick({
        examUUID: true,
        examName: true,
        numberOfSessions: true,
        spsExamName: true,
        error: true,
        errorType: true,
    })
    .extend({
        examStartTime: examStartTimeCodec,
        spsGroups: z.array(spsGroupInfoSchema).optional(),
    });

export type DeletionInfo = z.infer<typeof deletionInfoSchema>;

export const scheduledDeleteReportSchema = zScheduledDeleteReport
    .pick({
        id: true,
        deleteDueTime: true,
        scheduleTime: true,
        startTime: true,
        endTime: true,
    })
    .extend({
        state: stateCodec,
        examDeletions: z.array(deletionInfoSchema),
        spsOnlyDeletions: z.array(deletionInfoSchema),
    });

export type ScheduledDeleteReport = z.infer<typeof scheduledDeleteReportSchema>;
