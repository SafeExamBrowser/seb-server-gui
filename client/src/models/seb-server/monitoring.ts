type MonitoringOverview = {
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

type OverviewClientGroup = {
    id: number;
    name: string;
    clientAmount: number;
    spsGroupUUID?: string;
    type: string;
    typeValue: string;
}


type MonitoringConnections = {
    examId: number;
    monitoringConnectionData: MonitoringConnectionData;
    screenProctoringData: ScreenProctoringData[];
};

type MonitoringConnectionData = {
    cons: MonitoringClientConnection[];
    sm: number[];
    cgm: Record<string, number>;
    im: number[];
};

type MonitoringClientConnection = {
    id: number;
    nf: number;
    st: string;
    iv: Record<string, string>;
}

type ScreenProctoringData = {
    uuid: string;
    name: string;
    size: number;
};

type MonitoringStaticClientData = {
    staticClientConnectionData: StaticClientConnectionData[];
    duplications: Set<number>;
}

type StaticClientConnectionData = {
    id: number;
    connectionToken: string;
    examUserSessionId: string;
    ask: string;
    seb_info: string;
    cg: number[];
}

type SingleConnection = {
    miss: boolean;
    pnot: boolean;
    isVal: {
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
    }
}