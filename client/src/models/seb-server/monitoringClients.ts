import { IndicatorObject } from "@/models/seb-server/monitoringEnums";

export type MonitoringRow = {
    id: number;
    connectionToken: string;
    nameOrSession: string;
    clientGroups: ClientGroup[];
    connectionInfo: string;
    status: string;
    missing: boolean;
    invalidSEBVersion: boolean;
    indicators?: Map<number, IndicatorObject>;

    // indicators?: (IndicatorObject | undefined)[];
};
