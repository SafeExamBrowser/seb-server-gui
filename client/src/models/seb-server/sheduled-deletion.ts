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
    [ScheduledDeleteStatusEnum.PENDING]: "grey-darken-2",
    [ScheduledDeleteStatusEnum.SPS_RUNNING]: "red",
    [ScheduledDeleteStatusEnum.RUNNING]: "red",
    [ScheduledDeleteStatusEnum.FINISHED]: "green",
};

export type ScheduledDelete = {
    id: number;
    state: string;
    deleteDueTime: number; // timestamp (millis) must be converted to user date/time
    scheduleTime: number; // timestamp (millis) must be converted to user date/time
    startTime: number; // timestamp (millis) can be used to calc duration
    startEnd: number; // timestamp (millis) can be used to calc duration
    ownerUUID: string; // owner UUID must be resolved to user name
};

export type ScheduledDeleteItem = ScheduledDelete;

// TODO @andrei: this type guard can be removed, once the EntityTable uses a generic type for the item
export const isScheduledDeleteItem = (
    item: TableItem,
): item is ScheduledDeleteItem => typeof item.id === "number";

export type ScheduledDeletions = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ScheduledDelete[];
};
