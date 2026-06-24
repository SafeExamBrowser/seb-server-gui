import { addBrowserSuffixToText } from "../utils/helpers";
import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { USER_ACCOUNT_COLUMN } from "@/pages/(app)/user-account/userAccountListConfig.ts";

const searchSurname = "000-testgetall";
const activeUserUuid = "seb-user-account-getall-active";
const inactiveUserUuid = "seb-user-account-getall-inactive";
const institutionModelId = 11;

test.describe("01 User Accounts - READ Get All", () => {
    test("A searches by surname and shows matching rows", async ({
        userAccounts,
    }, testInfo) => {
        const surname = addBrowserSuffixToText(searchSurname, testInfo);
        const activeId = addBrowserSuffixToText(activeUserUuid, testInfo);
        const inactiveId = addBrowserSuffixToText(inactiveUserUuid, testInfo);

        await test.step("open list page", async () => {
            await userAccounts.goto();
            expect(userAccounts.page.url()).toContain("/user-account");
        });

        await test.step("search by surname triggers list request", async () => {
            await userAccounts.expectListRequestSucceeded(
                () => userAccounts.search(surname),
                {
                    urlMustContain: [
                        /[?&]surname=/i,
                        encodeURIComponent(surname),
                    ],
                },
            );
        });

        await test.step("active and inactive seeded rows are visible", async () => {
            await userAccounts.table.expectRowVisible(activeId);
            await userAccounts.table.expectRowVisible(inactiveId);
        });
    });

    test("B filters by status and (when available) institution", async ({
        userAccounts,
    }, testInfo) => {
        const surname = addBrowserSuffixToText(searchSurname, testInfo);
        const activeId = addBrowserSuffixToText(activeUserUuid, testInfo);
        const inactiveId = addBrowserSuffixToText(inactiveUserUuid, testInfo);

        await userAccounts.goto();
        await userAccounts.expectListRequestSucceeded(() =>
            userAccounts.search(surname),
        );
        await userAccounts.table.expectRowVisible(activeId);
        await userAccounts.table.expectRowVisible(inactiveId);

        await test.step("inactive filter shows only inactive row", async () => {
            await userAccounts.expectListRequestSucceeded(
                () => userAccounts.toggleStatusFilter("Inactive"),
                { urlMustContain: [/[?&]active=false/i] },
            );
            await userAccounts.table.expectRowVisible(inactiveId);
            await userAccounts.table.expectRowAbsent(activeId);
        });

        await test.step("active filter shows only active row", async () => {
            await userAccounts.expectListRequestSucceeded(
                () => userAccounts.toggleStatusFilter("Active"),
                { urlMustContain: [/[?&]active=true/i] },
            );
            await userAccounts.table.expectRowVisible(activeId);
            await userAccounts.table.expectRowAbsent(inactiveId);
        });

        await test.step("institution filter (if visible) narrows by institution", async () => {
            if (await userAccounts.hasInstitutionFilter()) {
                await userAccounts.expectInstitutionFilterVisible();
                await userAccounts.expectListRequestSucceeded(
                    () =>
                        userAccounts.toggleInstitutionFilter(
                            institutionModelId,
                        ),
                    {
                        urlMustContain: [
                            new RegExp(
                                `[?&]institutionId=${institutionModelId}`,
                                "i",
                            ),
                        ],
                    },
                );
                await userAccounts.table.expectVisible();
            } else {
                await userAccounts.expectInstitutionFilterAbsent();
            }
        });

        await test.step("clearAll resets search and filters", async () => {
            await userAccounts.clearSearchAndFilters();
            await userAccounts.searchBar.expectInputEmpty();
            await expect(userAccounts.searchBar.clearAllButton).toBeHidden();
        });
    });

    test("C sorts and paginates", async ({ userAccounts }, testInfo) => {
        const surname = addBrowserSuffixToText(searchSurname, testInfo);

        await userAccounts.goto();
        await userAccounts.expectListRequestSucceeded(() =>
            userAccounts.search(surname),
        );

        await test.step("sort by Username triggers sort=username", async () => {
            await userAccounts.expectListRequestSucceeded(
                () =>
                    userAccounts.table.sortByColumn(
                        USER_ACCOUNT_COLUMN.username,
                    ),
                { urlMustContain: [/[?&]sort=username/i] },
            );
        });

        await test.step("sort by Name triggers sort=name", async () => {
            await userAccounts.expectListRequestSucceeded(
                () => userAccounts.table.sortByColumn(USER_ACCOUNT_COLUMN.name),
                { urlMustContain: [/[?&]sort=name/i] },
            );
        });

        await test.step("go to page 2 if available", async () => {
            if (await userAccounts.table.hasPage(2)) {
                await userAccounts.expectListRequestSucceeded(
                    () => userAccounts.table.goToPage(2),
                    { urlMustContain: [/[?&]page_number=2/i] },
                );
            }
        });
    });

    test("D shows error UI when the list request fails with 500", async ({
        userAccounts,
    }) => {
        await userAccounts.page.route(/\/useraccount\?/i, (route) =>
            route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({
                    message: "Internal Server Error (forced by Playwright)",
                }),
            }),
        );

        await userAccounts.page.goto(userAccounts.config.route);
        await expect(
            userAccounts.page.getByText(/Something went wrong:/i),
        ).toBeVisible();
    });

    test("E row actions open confirm dialogs and cancel leaves data unchanged", async ({
        userAccounts,
    }, testInfo) => {
        const surname = addBrowserSuffixToText(searchSurname, testInfo);
        const activeId = addBrowserSuffixToText(activeUserUuid, testInfo);

        await userAccounts.goto();
        await userAccounts.expectListRequestSucceeded(() =>
            userAccounts.search(surname),
        );
        await userAccounts.table.expectRowVisible(activeId);

        await test.step("delete button opens the delete dialog; cancel keeps the row", async () => {
            await userAccounts.table.deleteButton(activeId).click();
            await userAccounts.deleteDialog.expectVisible();
            await userAccounts.deleteDialog.cancel();
            await userAccounts.deleteDialog.expectHidden();
            await userAccounts.table.expectRowVisible(activeId);
        });

        await test.step("status chip opens the status dialog; cancel keeps the status", async () => {
            await userAccounts.table.statusChip(activeId).click();
            await userAccounts.statusDialog.expectVisible();
            await userAccounts.statusDialog.cancel();
            await userAccounts.statusDialog.expectHidden();
            await userAccounts.table.expectStatusText(activeId, "Active");
        });
    });
});
