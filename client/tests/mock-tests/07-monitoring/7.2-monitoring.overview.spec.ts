import en from "@/i18n/locales/en.json" with { type: "json" };
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";

import { test } from "../fixtures/table-list-fixtures";
import {
    buildMonitoringOverview,
    MONITORED_EXAM_ID,
    MONITORING_CONNECTIONS,
} from "../mocks/monitoring-mock-data.ts";

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

    test.fixme("B clicking a state opens the client list filtered by that state", async () => {
        await test.step("click the Active state", async () => {});
        await test.step("url has show-states=ACTIVE", async () => {});
        await test.step("only the active clients are listed", async () => {});
    });

    test.fixme("C clicking a notification opens the client list filtered by it", async () => {
        await test.step("click Raise hand", async () => {});
        await test.step("url has show-notifications=RAISE_HAND", async () => {});
        await test.step("only the client with the raised hand is listed", async () => {});
    });

    test.fixme("D the list button of a group opens the clients of that group", async () => {
        await test.step("group tile shows active / total clients", async () => {});
        await test.step("click the list button of the group", async () => {});
        await test.step("url has show-client-groups=<id>&show-states=ACTIVE,MISSING", async () => {});
    });

    test.fixme("E quit all needs the typed confirmation and quits the clients", async () => {
        await test.step("open the quit all dialog", async () => {});
        await test.step("submit is disabled until YES is typed", async () => {});
        await test.step("confirming sends POST quitAll", async () => {});
        await test.step("the state counts update after the next poll", async () => {});
    });

    test.fixme("F shows the not-running warning for an exam that is not running", async () => {
        await test.step("open the overview of the finished exam", async () => {});
        await test.step("the warning is shown instead of the overview", async () => {});
    });
});
