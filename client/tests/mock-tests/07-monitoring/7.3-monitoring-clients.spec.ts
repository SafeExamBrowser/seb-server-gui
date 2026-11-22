import { test } from "../fixtures/table-list-fixtures";

test.describe("07 Monitoring - Client list", () => {
    test.use({ timezoneId: "UTC" });

    test.fixme("A shows all clients with name, groups and status", async () => {
        await test.step("open the client list with show-all", async () => {});
        await test.step("every connection is listed by its session name", async () => {});
        await test.step("each row shows its groups and status label", async () => {});
    });

    test.fixme("B a state filter in the url is sent as header and filters the rows", async () => {
        await test.step("open the client list with show-states=ACTIVE,MISSING", async () => {});
        await test.step("the connections request carries the show-states header", async () => {});
        await test.step("only active and missing clients are listed", async () => {});
    });

    test.fixme("C the filter panel updates the url and clear all resets it", async () => {
        await test.step("toggle the Ready state filter", async () => {});
        await test.step("url and rows follow the filter", async () => {});
        await test.step("clear all sets show-all=true and lists every client", async () => {});
    });

    test.fixme("D search filters the loaded rows without a request", async () => {
        await test.step("search for a session name", async () => {});
        await test.step("only the matching row is listed", async () => {});
        await test.step("no extra connections request with the search text was sent", async () => {});
    });

    test.fixme("E an armed action only allows the eligible rows", async () => {
        await test.step("arm Lock", async () => {});
        await test.step("active and ready clients are selectable, the others are not", async () => {});
        await test.step("confirm is disabled until a row is selected", async () => {});
    });

    test.fixme("F bulk lock sends the lock instruction with the message", async () => {
        await test.step("arm Lock, select two clients and enter a message", async () => {});
        await test.step("confirm sends SEB_FORCE_LOCK_SCREEN with both tokens and the message", async () => {});
        await test.step("the lock icon is shown on both rows", async () => {});
    });

    test.fixme("G bulk quit sends the quit instruction", async () => {
        await test.step("arm Quit and select a client", async () => {});
        await test.step("confirm sends SEB_QUIT with its token", async () => {});
        await test.step("the client is shown as Closed", async () => {});
    });

    test.fixme("H bulk unlock unlocks the client with the pending lock", async () => {
        await test.step("arm Unlock and select the locked client", async () => {});
        await test.step("confirm sends unlock-screens with its token", async () => {});
        await test.step("the lock icon is gone", async () => {});
    });

    test.fixme("I bulk cancel marks missing and closed clients as canceled", async () => {
        await test.step("arm Cancel and select the missing and the closed client", async () => {});
        await test.step("confirm sends disable-connection with both tokens", async () => {});
        await test.step("both clients are shown as Canceled", async () => {});
    });

    test.fixme("J the chevron opens the client and back keeps the filters", async () => {
        await test.step("open the client list with a state filter", async () => {});
        await test.step("open a client by its chevron", async () => {});
        await test.step("back to client list restores the filter", async () => {});
    });
});
