import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";

import { test } from "../fixtures/table-list-fixtures";

const ACTION_STATES = [
    ConnectionStatusEnum.ACTIVE,
    ConnectionStatusEnum.MISSING,
    ConnectionStatusEnum.CLOSED,
    ConnectionStatusEnum.DISABLED,
];

test.describe("07 Monitoring - Client detail", () => {
    test.use({ timezoneId: "UTC" });

    test.fixme("A shows name, status, groups, SEB info and indicators", async () => {
        await test.step("open the active client", async () => {});
        await test.step("name and status are shown", async () => {});
        await test.step("groups and SEB info chips are shown", async () => {});
        await test.step("indicator values are shown", async () => {});
    });

    for (const state of ACTION_STATES) {
        test.fixme(`B enables the actions allowed for a ${state} client`, async () => {
            await test.step("open the client in this state", async () => {});
            await test.step("lock, quit and mark cancelled are enabled as allowed", async () => {});
        });
    }

    test.fixme("C lock sends the instruction and shows the unlock card", async () => {
        await test.step("lock with a message", async () => {});
        await test.step("the request is SEB_FORCE_LOCK_SCREEN with the message", async () => {});
        await test.step("lock is disabled and the unlock screen card is shown", async () => {});
    });

    test.fixme("D unlock screen confirms the lock notification", async () => {
        await test.step("open the client with a pending lock", async () => {});
        await test.step("unlock screen sends the notification confirm", async () => {});
        await test.step("the card is gone", async () => {});
    });

    test.fixme("E resolve raise hand confirms the raise hand notification", async () => {
        await test.step("open the client with a raised hand", async () => {});
        await test.step("resolve sends the notification confirm", async () => {});
        await test.step("the card is gone", async () => {});
    });

    test.fixme("F quit sends the instruction and the client becomes closed", async () => {
        await test.step("quit the active client", async () => {});
        await test.step("the request is SEB_QUIT", async () => {});
        await test.step("the status is Closed", async () => {});
    });

    test.fixme("G mark cancelled disables a missing client", async () => {
        await test.step("mark the missing client as cancelled", async () => {});
        await test.step("disable-connection is sent with its token", async () => {});
        await test.step("the status is Canceled", async () => {});
    });

    test.fixme("H cancelling the dialog sends nothing", async () => {
        await test.step("open and cancel the quit dialog", async () => {});
        await test.step("no instruction request was sent", async () => {});
    });

    test.fixme("I lists, filters, searches and pages the client logs", async () => {
        await test.step("the first page of logs is listed", async () => {});
        await test.step("the error tab sends type=ERROR_LOG", async () => {});
        await test.step("search sends the text", async () => {});
        await test.step("page 2 is requested and shown", async () => {});
    });

    test.fixme("J with screen proctoring both tabs are shown and logs still work", async () => {
        await test.step("open a client of the exam with screen proctoring", async () => {});
        await test.step("screen proctoring and client logs tabs are shown", async () => {});
        await test.step("the client logs tab lists the logs", async () => {});
    });
});
