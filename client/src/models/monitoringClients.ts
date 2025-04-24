import { IndicatorObject } from "@/models/monitoringEnums";

export type MonitoringRow = {
    id: number;
    connectionToken: string;
    nameOrSession: string;
    clientGroups: ClientGroup[];
    connectionInfo: string;
    status: string;

    indicators?: Map<number, IndicatorObject>

    // indicators?: (IndicatorObject | undefined)[];
}