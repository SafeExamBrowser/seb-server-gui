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
        BATTERY_STATUS?: number;
        WLAN_STATUS?: number;
    };

    notifications: {
        LOCK_SCREEN?: number;
        RAISE_HAND?: number;
    };
};

type OverviewClientGroup = {
    id: number;
    clientAmount: number;
    name: string;
    screenProctoring: boolean;
    type: string;
    typeValue: string;
}


type MonitoringFullPageData = {
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
    conectionToken: string;
    examUserSessionId: string;
    ask: string;
    seb_info: string;
    cg: number[];
}