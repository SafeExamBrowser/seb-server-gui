import { IndicatorObject } from "@/models/indicatorEnum";

export type MonitoringRow = {
    nameOrSession: string;
    clientGroups: string;
    connectionInfo: string;
    status: string;
    ping: IndicatorObject | string;
}