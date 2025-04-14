import { IndicatorObject } from "@/models/indicatorEnum";

export type MonitoringRow = {
    id: number;
    connectionToken: string;
    nameOrSession: string;
    clientGroups: string;
    connectionInfo: string;
    status: string;
    ping: IndicatorObject | undefined;
}