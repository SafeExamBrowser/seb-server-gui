import { type Page } from "@playwright/test";

import type { ClientInstruction } from "@/models/seb-server/clientInstruction.ts";
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
    MONITORING_CONNECTIONS,
} from "./monitoring-mock-data.ts";

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
    return notImplemented(headers);
}

export function filterConnections(
    connections: MockMonitoringConnection[],
    filter: MonitoringFilterHeaders,
): MockMonitoringConnection[] {
    return notImplemented(connections, filter);
}

export function toCompactConnection(
    connection: MockMonitoringConnection,
): MonitoringClientConnection {
    return notImplemented(connection);
}

export function toStaticClientData(
    connection: MockMonitoringConnection,
): StaticClientConnectionData {
    return notImplemented(connection);
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
    return notImplemented(state);
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
