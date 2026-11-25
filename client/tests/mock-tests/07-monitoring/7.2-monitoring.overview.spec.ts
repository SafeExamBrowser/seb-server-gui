import en from "@/i18n/locales/en.json" with { type: "json" };
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";

import { expect, test } from "../fixtures/table-list-fixtures";
import {
    buildMonitoringOverview,
    connectionsInState,
    MONITORED_EXAM_ID,
    MONITORING_CLIENT_GROUPS,
    MONITORING_CONNECTIONS,
    NOT_RUNNING_EXAM_ID,
    NOTIFICATION_FLAGS,
} from "../mocks/monitoring-mock-data.ts";

const roomA = MONITORING_CLIENT_GROUPS[0];

test.describe("07 Monitoring - Overview", () => {
    test.use({ timezoneId: "UTC" });

    test("A shows the total and the count per client state", async ({
        monitoringOverview,
    }) => {
        const overview = buildMonitoringOverview(MONITORING_CONNECTIONS);

        await test.step("open the overview of the monitored exam", async () => {
            await monitoringOverview.goto(MONITORED_EXAM_ID);
        });

        await test.step("total in the header matches buildMonitoringOverview", async () => {
            await monitoringOverview.expectConnectionsTotal(
                overview.clientStates.total,
            );
        });

        await test.step("every state row shows its count", async () => {
            const states = [
                ConnectionStatusEnum.CONNECTION_REQUESTED,
                ConnectionStatusEnum.READY,
                ConnectionStatusEnum.ACTIVE,
                ConnectionStatusEnum.CLOSED,
                ConnectionStatusEnum.DISABLED,
                ConnectionStatusEnum.MISSING,
            ] as const;
            for (const state of states) {
                await monitoringOverview.expectStateCount(
                    en[state],
                    overview.clientStates[state] ?? 0,
                );
            }
        });
    });

    test("B clicking a state opens the client list filtered by that state", async ({
        monitoringOverview,
        monitoringClients,
    }) => {
        await monitoringOverview.goto(MONITORED_EXAM_ID);

        await test.step("click the Active state", async () => {
            await monitoringOverview.clickState(en.ACTIVE);
        });

        await test.step("url has show-states=ACTIVE", async () => {
            await monitoringClients.expectQuery(MONITORED_EXAM_ID, {
                "show-states": "ACTIVE",
            });
        });

        await test.step("only the active clients are listed", async () => {
            await monitoringClients.expectRowNames(
                connectionsInState(
                    MONITORING_CONNECTIONS,
                    ConnectionStatusEnum.ACTIVE,
                ).map((c) => c.examUserSessionId),
            );
        });
    });

    test("C clicking a notification opens the client list filtered by it", async ({
        monitoringOverview,
        monitoringClients,
    }) => {
        await monitoringOverview.goto(MONITORED_EXAM_ID);

        await test.step("click Raise hand", async () => {
            await monitoringOverview.clickNotification(en.RAISE_HAND);
        });

        await test.step("url has show-notifications=RAISE_HAND", async () => {
            await monitoringClients.expectQuery(MONITORED_EXAM_ID, {
                "show-notifications": "RAISE_HAND",
            });
        });

        await test.step("only the client with the raised hand is listed", async () => {
            await monitoringClients.expectRowNames(
                MONITORING_CONNECTIONS.filter(
                    (c) => c.flags & NOTIFICATION_FLAGS.RAISE_HAND,
                ).map((c) => c.examUserSessionId),
            );
        });
    });

    test("D the list button of a group opens the clients of that group", async ({
        monitoringOverview,
        monitoringClients,
    }) => {
        await monitoringOverview.goto(MONITORED_EXAM_ID);

        await test.step("group tile shows its active clients", async () => {
            await monitoringOverview.expectGroupClients(roomA.name, 2);
        });

        await test.step("click the list button of the group", async () => {
            await monitoringOverview.clickGroupList(roomA.name);
        });

        await test.step("url has show-client-groups=<id>&show-states=ACTIVE,MISSING", async () => {
            await monitoringClients.expectQuery(MONITORED_EXAM_ID, {
                "show-client-groups": String(roomA.id),
                "show-states": "ACTIVE,MISSING",
            });
        });
    });

    test("E quit all needs the typed confirmation and quits the clients", async ({
        monitoringOverview,
    }) => {
        const page = monitoringOverview.page;

        // counts every quit-all request the page sends, so the test can prove
        // that the click without YES sent none (checked once the YES request is through)
        const isQuitAll = (url: string) =>
            new RegExp(`/monitoring/${MONITORED_EXAM_ID}/quitAll$`).test(url);
        let quitAllRequests = 0;
        page.on("request", (request) => {
            if (isQuitAll(request.url())) {
                quitAllRequests++;
            }
        });

        await monitoringOverview.goto(MONITORED_EXAM_ID);

        const dialog = await test.step("open the quit all dialog", () =>
            monitoringOverview.openQuitAllDialog());

        await test.step("quit without YES keeps the dialog open", async () => {
            await monitoringOverview.confirmQuitAll("yes");
            await expect(dialog).toBeVisible();
        });

        await test.step("confirming sends POST quitAll, and only this once", async () => {
            const request = page.waitForRequest(
                (r) => r.method() === "POST" && isQuitAll(r.url()),
            );
            await monitoringOverview.confirmQuitAll("YES");
            await request;
            await expect(dialog).toBeHidden();
            expect(quitAllRequests).toBe(1);
        });

        await test.step("the state counts update after the next poll", async () => {
            // the overview polls every 5s
            await expect(async () => {
                await monitoringOverview.expectStateCount(en.ACTIVE, 0);
                await monitoringOverview.expectStateCount(en.CLOSED, 4);
            }).toPass({ timeout: 10_000 });
        });
    });

    test("F shows the not-running warning for an exam that is not running", async ({
        monitoringOverview,
    }) => {
        await test.step("open the overview of the finished exam", async () => {
            await monitoringOverview.page.goto(
                monitoringOverview.url(NOT_RUNNING_EXAM_ID),
            );
        });

        await test.step("the warning is shown instead of the overview", async () => {
            await monitoringOverview.expectMonitoringDisabledWarning(
                en.monitoringOverview.warning.notRunning,
            );
        });
    });
});
