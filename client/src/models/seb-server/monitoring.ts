type MonitoringClientConnection = {
    id: number;
    nf: number;
    st: string;
    iv: Record<string, string>;
};

type OverviewClientGroup = {
    id: number;
    name: string;
    clientAmount: number;
    spsGroupUUID?: string;
    type: string;
    typeValue: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

type ScreenProctoringData = {
    uuid: string;
    name: string;
    size: number;
};

type MonitoringConnectionData = {
    cons: MonitoringClientConnection[];
    sm: number[];
    cgm: Record<string, number>;
    im: number[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type MonitoringConnections = {
    examId: number;
    monitoringConnectionData: MonitoringConnectionData;
    screenProctoringData: ScreenProctoringData[];
};

type StaticClientConnectionData = {
    id: number;
    connectionToken: string;
    examUserSessionId: string;
    ask: string;
    seb_info: string;
    cg: number[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type MonitoringStaticClientData = {
    staticClientConnectionData: StaticClientConnectionData[];
    duplications: Set<number>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SingleConnection = {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ClientNotification = {
    id: number;
    clientConnectionId: number;
    type: string;
    timestamp: number;
    serverTime: number;
    numericValue: number;
    text: string;
    notificationType: string;
};

type ClientEvent = {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ClientEventResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ClientEvent[];
    complete: boolean;
};
