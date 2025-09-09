type SebClientConnection = {
    id: number;
    institutionId: number;
    examId: number;
    status: SebClientConnectionStatusEnum;
    connectionToken: string;
    examUserSessionId: string;
    seb_info: string;
    clientAddress: string;
    clientOsName: string;
    clientVersion: string;
    securityCheckGranted: boolean;
    clientVersionGranted?: boolean;
};

enum SebClientConnectionStatusEnum {
    UNDEFINED = "UNDEFINED",
    CONNECTION_REQUESTED = "CONNECTION_REQUESTED",
    READY = "READY",
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED",
    MISSING = "MISSING",
    CLOSED = "CLOSED",
}
