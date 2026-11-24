import { type Page } from "@playwright/test";

import type { ClientInstruction } from "@/models/seb-server/clientInstruction.ts";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import type {
    ClientEventResponse,
    ClientNotification,
    MonitoringClientConnection,
    SingleConnection,
    StaticClientConnectionData,
} from "@/models/seb-server/monitoring.ts";

import { notImplemented } from "../../utils/helpers.ts";
import { getOnly, json } from "./mock-backend.ts";
import {
    buildMonitoringOverview,
    type MockMonitoringConnection,
    MONITORED_EXAM_ID,
    MONITORED_EXAM_WITH_SPS_ID,
    MONITORING_CLIENT_GROUPS,
    MONITORING_CONNECTIONS,
    NOTIFICATION_FLAGS,
} from "./monitoring-mock-data.ts";

const NOTIFICATION_FLAG_BY_TYPE: Record<string, number> = {
    LOCK_SCREEN: NOTIFICATION_FLAGS.LOCK_PENDING,
    RAISE_HAND: NOTIFICATION_FLAGS.RAISE_HAND,
};

// changed by the action routes, so the next poll returns the new state
export type MonitoringMockState = {
    connections: Map<string, MockMonitoringConnection>;
    notifications: Map<string, ClientNotification[]>;
};

export type MonitoringFilterHeaders = {
    showAll: boolean;
    states: string[];
    clientGroups: string[];
    notifications: string[];
    indicators: string[];
};

// Routes (registered after the generic ones in mock-backend.ts, so they win):
// GET  /indicator?examId                             MONITORING_INDICATORS
// GET  /client-group?examId                          MONITORING_CLIENT_GROUPS
// GET  /monitoring/overview/:examId                  buildMonitoringOverview(state)
// GET  /monitoring/connections/:examId               compact rows, filtered by the show-* headers
// POST /monitoring/:examId/static-client-data        static rows of the posted modelIds
// GET  /monitoring/:examId/:token                    single connection
// GET  /monitoring/:examId/notification/:token       pending notifications
// POST /monitoring/:examId/notification/:id/:token   confirm a notification
// POST /monitoring/:examId/notification/unlock-screens
// POST /monitoring/:examId/instruction               SEB_QUIT / SEB_FORCE_LOCK_SCREEN
// POST /monitoring/:examId/disable-connection
// POST /monitoring/:examId/quitAll
// GET  /seb-client-event/search                      CLIENT_EVENTS, paged and filtered
// GET  /sps/proctoring/screenshot-data/*             404, so the proctoring view hides itself
export async function installMonitoringMocks(page: Page): Promise<void> {
    const state = createMonitoringState();

    // the catch-all's {} would crash getAskAndStore, which maps over both lists
    await page.route(
        /\/api\/exam\/\d+\/(?:sebkeyinfo|grant)(?:$|\?)/,
        getOnly((route) => json(route, [])),
    );

    await page.route(
        /\/api\/monitoring\/overview\/\d+(?:$|\?)/,
        getOnly((route) =>
            json(
                route,
                buildMonitoringOverview([...state.connections.values()]),
            ),
        ),
    );

    await page.route(
        /\/api\/client-group(?:$|\?)/,
        getOnly((route, url) => {
            const examId = Number(url.searchParams.get("examId"));
            if (
                examId !== MONITORED_EXAM_ID &&
                examId !== MONITORED_EXAM_WITH_SPS_ID
            ) {
                return route.fallback();
            }
            return json(route, {
                number_of_pages: 1,
                page_number: 1,
                page_size: MONITORING_CLIENT_GROUPS.length,
                content: MONITORING_CLIENT_GROUPS.map(({ id, name, type }) => ({
                    id,
                    examId,
                    name,
                    type,
                })),
            });
        }),
    );

    await page.route(
        /\/api\/monitoring\/connections\/(\d+)(?:$|\?)/,
        getOnly((route, url) => {
            const filter = parseFilterHeaders(route.request().headers());
            const connections = filterConnections(
                [...state.connections.values()],
                filter,
            );
            return json(route, {
                examId: Number(url.pathname.split("/").pop()),
                monitoringConnectionData: {
                    cons: connections.map(toCompactConnection),
                    sm: [],
                    cgm: {},
                    im: [],
                },
                screenProctoringData: [],
            });
        }),
    );

    await page.route(
        /\/api\/monitoring\/\d+\/static-client-data(?:$|\?)/,
        (route) => {
            const modelIds = new URLSearchParams(
                route.request().postData() ?? "",
            )
                .get("modelIds")
                ?.split(",")
                .map(Number);
            return json(route, {
                staticClientConnectionData: [...state.connections.values()]
                    .filter((c) => modelIds?.includes(c.id))
                    .map(toStaticClientData),
                duplications: [],
            });
        },
    );

    await page.route(/\/api\/monitoring\/\d+\/quitAll(?:$|\?)/, (route) => {
        if (route.request().method() !== "POST") {
            return route.fallback();
        }
        quitAll(state);
        return json(route, {});
    });
}

export function createMonitoringState(): MonitoringMockState {
    return {
        connections: new Map(
            MONITORING_CONNECTIONS.map((c) => [
                c.connectionToken,
                structuredClone(c),
            ]),
        ),
        notifications: new Map(),
    };
}

export function parseFilterHeaders(
    headers: Record<string, string>,
): MonitoringFilterHeaders {
    const list = (name: string) =>
        (headers[name] ?? "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);

    return {
        showAll: headers["show-all"] === "true",
        states: list("show-states"),
        clientGroups: list("show-client-groups"),
        notifications: list("show-notifications"),
        indicators: list("show-indicators"),
    };
}

export function filterConnections(
    connections: MockMonitoringConnection[],
    filter: MonitoringFilterHeaders,
): MockMonitoringConnection[] {
    if (filter.showAll) {
        return connections;
    }

    // shortcut: show-indicators is ignored, add it once a spec filters by indicator
    return connections.filter(
        (c) =>
            (filter.states.length === 0 || filter.states.includes(c.status)) &&
            (filter.clientGroups.length === 0 ||
                c.groupIds.some((id) =>
                    filter.clientGroups.includes(String(id)),
                )) &&
            (filter.notifications.length === 0 ||
                filter.notifications.some(
                    (type) => c.flags & (NOTIFICATION_FLAG_BY_TYPE[type] ?? 0),
                )),
    );
}

export function toCompactConnection(
    connection: MockMonitoringConnection,
): MonitoringClientConnection {
    return {
        id: connection.id,
        nf: connection.flags,
        st: connection.status,
        iv: Object.fromEntries(
            Object.entries(connection.indicatorValues).map(([id, value]) => [
                id,
                String(value),
            ]),
        ),
    };
}

export function toStaticClientData(
    connection: MockMonitoringConnection,
): StaticClientConnectionData {
    return {
        id: connection.id,
        connectionToken: connection.connectionToken,
        examUserSessionId: connection.examUserSessionId,
        ask: "",
        seb_info: connection.sebInfo,
        cg: connection.groupIds,
    };
}

export function toSingleConnection(
    connection: MockMonitoringConnection,
): SingleConnection {
    return notImplemented(connection);
}

// tokens arrive comma-joined, e.g. "token-1,token-2"
export function applyInstruction(
    state: MonitoringMockState,
    instruction: ClientInstruction,
): void {
    return notImplemented(state, instruction);
}

export function unlockScreens(
    state: MonitoringMockState,
    connectionTokens: string[],
): void {
    return notImplemented(state, connectionTokens);
}

export function disableConnections(
    state: MonitoringMockState,
    connectionTokens: string[],
): void {
    return notImplemented(state, connectionTokens);
}

export function quitAll(state: MonitoringMockState): void {
    for (const connection of state.connections.values()) {
        if (connection.status === ConnectionStatusEnum.ACTIVE) {
            connection.status = ConnectionStatusEnum.CLOSED;
        }
    }
}

export function confirmNotification(
    state: MonitoringMockState,
    connectionToken: string,
    notificationId: number,
): void {
    return notImplemented(state, connectionToken, notificationId);
}

export function searchClientEvents(
    params: URLSearchParams,
): ClientEventResponse {
    return notImplemented(params);
}
