import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";

export type MonitoringClientConnection = {
    id: number;
    nf: number;
    st: string;
    iv: Record<string, string>;
};

export type OverviewClientGroup = {
    id: number;
    name: string;
    clientAmount: number;
    spsGroupUUID?: string;
    type: string;
    typeValue: string;
};

export type MonitoringOverview = {
    clientStates: {
        total: number;
        CONNECTION_REQUESTED?: number;
        READY?: number;
        ACTIVE?: number;
        DISABLED?: number;
        MISSING?: number;
        CLOSED?: number;
    };

    clientGroups: OverviewClientGroup[];

    indicators: {
        BATTERY_STATUS?: {
            color?: string;
            incident: number;
            warning: number;
        };
        WLAN_STATUS?: {
            color?: string;
            incident: number;
            warning: number;
        };
    };

    notifications: {
        total: number;
        LOCK_SCREEN?: number;
        RAISE_HAND?: number;
    };
};

export type ScreenProctoringData = {
    uuid: string;
    name: string;
    size: number;
};

export type MonitoringConnectionData = {
    cons: MonitoringClientConnection[];
    sm: number[];
    cgm: Record<string, number>;
    im: number[];
};

export type MonitoringConnections = {
    examId: number;
    monitoringConnectionData: MonitoringConnectionData;
    screenProctoringData: ScreenProctoringData[];
};

export type MonitoringConnectionHeaders = {
    [MonitoringHeaderEnum.SHOW_ALL]: boolean;
    [MonitoringHeaderEnum.SHOW_CLIENT_GROUPS]: string[];
    [MonitoringHeaderEnum.SHOW_STATES]: string[];
    [MonitoringHeaderEnum.SHOW_NOTIFCATION]: string[];
    [MonitoringHeaderEnum.SHOW_INDICATORS]: string[];
};

export type StaticClientConnectionData = {
    id: number;
    connectionToken: string;
    examUserSessionId: string;
    ask: string;
    seb_info: string;
    cg: number[];
};

export type MonitoringStaticClientData = {
    staticClientConnectionData: StaticClientConnectionData[];
    duplications: Set<number>;
};

export type SingleConnection = {
    miss: boolean;
    pnot: boolean;
    iVal: {
        id: number;
        val: number;
    }[];
    cg: number[];
    cdat: {
        clientAddress: string;
        connectionToken: string;
        examId: number;
        examUserSessionId: string;
        id: number;
        institutionId: number;
        seb_info: string;
        status: string;
    };
};

export type ClientNotification = {
    id: number;
    clientConnectionId: number;
    type: string;
    timestamp: number;
    serverTime: number;
    numericValue: number;
    text: string;
    notificationType: string;
};

export type ClientEvent = {
    id: number;
    clientConnectionId: number;
    institutionId: number;
    examId: number;
    examUserSessionId: string;
    type: string;
    timestamp: number;
    serverTime: number;
    text: string;
    value: string;
    numericValue: number;
    notificationType: string;
};

export type ClientEventResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ClientEvent[];
    complete: boolean;
};
