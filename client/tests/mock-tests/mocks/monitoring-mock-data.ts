import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import type {
    ClientEvent,
    ClientNotification,
    MonitoringOverview,
    OverviewClientGroup,
} from "@/models/seb-server/monitoring.ts";

import { notImplemented } from "../../utils/helpers.ts";

// bits of the `nf` field of a monitoring connection (see MonitoringClientsTable.vue)
export const NOTIFICATION_FLAGS = {
    MISSING: 1,
    LOCK_PENDING: 2,
    RAISE_HAND: 32,
} as const;

export type MockMonitoringConnection = {
    id: number;
    connectionToken: string;
    examUserSessionId: string;
    sebInfo: string;
    groupIds: number[];
    status: ConnectionStatusEnum;
    flags: number;
    // indicator id -> value
    indicatorValues: Record<number, number>;
};

export type MockIndicator = {
    id: number;
    examId: number;
    name: string;
    type: string;
    color?: string;
    thresholds: { value: number; color: string }[];
};

export const MONITORED_EXAM_ID = 9601;
export const MONITORED_EXAM_WITH_SPS_ID = 9602;
export const NOT_RUNNING_EXAM_ID = 9603;

export const MONITORED_EXAM = {
    id: MONITORED_EXAM_ID,
    institutionId: 11,
    lmsSetupId: 9101,
    quizName: "e2e-monitoring-exam",
    quizStartTime: "2026-01-12T08:00:00.000Z",
    quizEndTime: "2030-01-12T10:00:00.000Z",
    type: "BYOD",
    status: "RUNNING",
    supporter: [],
    additionalAttributes: { enableScreenProctoring: "false" },
};

export const MONITORED_EXAM_WITH_SPS = {
    ...MONITORED_EXAM,
    id: MONITORED_EXAM_WITH_SPS_ID,
    quizName: "e2e-monitoring-exam-sps",
    additionalAttributes: { enableScreenProctoring: "true" },
};

export const NOT_RUNNING_EXAM = {
    ...MONITORED_EXAM,
    id: NOT_RUNNING_EXAM_ID,
    quizName: "e2e-monitoring-exam-finished",
    status: "FINISHED",
};

export const MONITORING_INDICATORS: MockIndicator[] = [];

export const ROOM_A_GROUP_ID = 9701;

// clientAmount and activeClients are counted from the connections in buildMonitoringOverview
export const MONITORING_CLIENT_GROUPS: Omit<
    OverviewClientGroup,
    "clientAmount" | "activeClients"
>[] = [
    {
        id: ROOM_A_GROUP_ID,
        name: "Room A",
        type: "IP_V4_RANGE",
        typeValue: "10.0.0.1 - 10.0.0.50",
    },
];

function connection(
    id: number,
    status: ConnectionStatusEnum,
    flags = 0,
    groupIds: number[] = [],
): MockMonitoringConnection {
    return {
        id,
        connectionToken: `token-${id}`,
        examUserSessionId: `student-${id}`,
        sebInfo: "SEB 3.9 (Windows)",
        groupIds,
        status,
        flags,
        indicatorValues: {},
    };
}

// one connection per state, plus one with a pending lock and one with a raised hand
export const MONITORING_CONNECTIONS = [
    connection(1, ConnectionStatusEnum.CONNECTION_REQUESTED),
    connection(2, ConnectionStatusEnum.READY, 0, [ROOM_A_GROUP_ID]),
    connection(3, ConnectionStatusEnum.ACTIVE, 0, [ROOM_A_GROUP_ID]),
    connection(4, ConnectionStatusEnum.CLOSED),
    connection(5, ConnectionStatusEnum.DISABLED),
    connection(6, ConnectionStatusEnum.MISSING, NOTIFICATION_FLAGS.MISSING),
    connection(
        7,
        ConnectionStatusEnum.ACTIVE,
        NOTIFICATION_FLAGS.LOCK_PENDING,
        [ROOM_A_GROUP_ID],
    ),
    connection(8, ConnectionStatusEnum.ACTIVE, NOTIFICATION_FLAGS.RAISE_HAND),
];

export const MONITORING_NOTIFICATIONS: ClientNotification[] = [];

// log entries of the first connection, enough for a second page
export const CLIENT_EVENTS: ClientEvent[] = [];

export function connectionBySession(
    examUserSessionId: string,
): MockMonitoringConnection {
    return notImplemented(examUserSessionId);
}

export function connectionsInState(
    connections: MockMonitoringConnection[],
    status: ConnectionStatusEnum,
): MockMonitoringConnection[] {
    return connections.filter((c) => c.status === status);
}

export function buildMonitoringOverview(
    connections: MockMonitoringConnection[],
): MonitoringOverview {
    const count = (status: ConnectionStatusEnum) =>
        connectionsInState(connections, status).length;
    const flagged = (flag: number) =>
        connections.filter((c) => c.flags & flag).length;

    return {
        clientStates: {
            total: connections.length,
            CONNECTION_REQUESTED: count(
                ConnectionStatusEnum.CONNECTION_REQUESTED,
            ),
            READY: count(ConnectionStatusEnum.READY),
            ACTIVE: count(ConnectionStatusEnum.ACTIVE),
            DISABLED: count(ConnectionStatusEnum.DISABLED),
            MISSING: count(ConnectionStatusEnum.MISSING),
            CLOSED: count(ConnectionStatusEnum.CLOSED),
        },
        clientGroups: MONITORING_CLIENT_GROUPS.map((group) => {
            const members = connections.filter((c) =>
                c.groupIds.includes(group.id),
            );
            return {
                ...group,
                clientAmount: members.length,
                activeClients: connectionsInState(
                    members,
                    ConnectionStatusEnum.ACTIVE,
                ).length,
            };
        }),
        indicators: {},
        notifications: {
            total:
                flagged(NOTIFICATION_FLAGS.LOCK_PENDING) +
                flagged(NOTIFICATION_FLAGS.RAISE_HAND),
            LOCK_SCREEN: flagged(NOTIFICATION_FLAGS.LOCK_PENDING),
            RAISE_HAND: flagged(NOTIFICATION_FLAGS.RAISE_HAND),
        },
    };
}
