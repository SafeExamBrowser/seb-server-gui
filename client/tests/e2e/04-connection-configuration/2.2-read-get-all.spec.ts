import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { CONNECTION_CONFIGURATION_COLUMN } from "@/pages/(app)/connection-configuration/connectionConfigurationListConfig.ts";

const searchName = "e2e-getall-connection-config";
const activeId = 9001;
const inactiveId = 9002;
const institutionModelId = 11;

test.describe("04 Connection Configurations - READ Get All", () => {
    test("A searches by name and shows the matching rows", async ({
        connectionConfigurations,
    }) => {
        await test.step("open list page", async () => {
            await connectionConfigurations.goto();
            expect(connectionConfigurations.page.url()).toContain(
                "/connection-configuration",
            );
        });

        await test.step("search by name triggers list request", async () => {
            await connectionConfigurations.expectListRequestSucceeded(
                () => connectionConfigurations.search(searchName),
                {
                    urlMustContain: [
                        /[?&]name=/i,
                        encodeURIComponent(searchName),
                    ],
                },
            );
        });

        await test.step("active and inactive seeded rows are visible", async () => {
            await connectionConfigurations.table.expectRowVisible(activeId);
            await connectionConfigurations.table.expectRowVisible(inactiveId);
        });
    });

    test("B filters by status and (when available) institution", async ({
        connectionConfigurations,
    }) => {
        await connectionConfigurations.goto();
        await connectionConfigurations.expectListRequestSucceeded(() =>
            connectionConfigurations.search(searchName),
        );
        await connectionConfigurations.table.expectRowVisible(activeId);
        await connectionConfigurations.table.expectRowVisible(inactiveId);

        await test.step("inactive filter shows only the inactive row", async () => {
            await connectionConfigurations.expectListRequestSucceeded(
                () => connectionConfigurations.toggleStatusFilter("Inactive"),
                { urlMustContain: [/[?&]active=false/i] },
            );
            await connectionConfigurations.table.expectRowVisible(inactiveId);
            await connectionConfigurations.table.expectRowAbsent(activeId);
        });

        await test.step("active filter shows only the active row", async () => {
            await connectionConfigurations.expectListRequestSucceeded(
                () => connectionConfigurations.toggleStatusFilter("Active"),
                { urlMustContain: [/[?&]active=true/i] },
            );
            await connectionConfigurations.table.expectRowVisible(activeId);
            await connectionConfigurations.table.expectRowAbsent(inactiveId);
        });

        await test.step("institution filter (if visible) narrows by institution", async () => {
            if (await connectionConfigurations.hasInstitutionFilter()) {
                await connectionConfigurations.expectInstitutionFilterVisible();
                await connectionConfigurations.expectListRequestSucceeded(
                    () =>
                        connectionConfigurations.toggleInstitutionFilter(
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
                await connectionConfigurations.table.expectVisible();
            } else {
                await connectionConfigurations.expectInstitutionFilterAbsent();
            }
        });

        await test.step("clearAll resets search and filters", async () => {
            await connectionConfigurations.clearSearchAndFilters();
            await connectionConfigurations.searchBar.expectInputEmpty();
            await expect(
                connectionConfigurations.searchBar.clearAllButton,
            ).toBeHidden();
        });
    });

    test("C sorts and paginates", async ({ connectionConfigurations }) => {
        await connectionConfigurations.goto();
        await connectionConfigurations.expectListRequestSucceeded(() =>
            connectionConfigurations.search(searchName),
        );
        await connectionConfigurations.table.expectRowVisible(activeId);

        await test.step("sort by Name ascending triggers sort=name", async () => {
            await connectionConfigurations.expectListRequestSucceeded(
                () =>
                    connectionConfigurations.table.sortByColumn(
                        CONNECTION_CONFIGURATION_COLUMN.name,
                    ),
                { urlMustContain: [/[?&]sort=name(?:&|$)/i] },
            );
        });

        await test.step("sort by Name again triggers descending sort=-name", async () => {
            await connectionConfigurations.expectListRequestSucceeded(
                () =>
                    connectionConfigurations.table.sortByColumn(
                        CONNECTION_CONFIGURATION_COLUMN.name,
                    ),
                { urlMustContain: [/[?&]sort=-name/i] },
            );
        });

        await test.step("sort by Creation Date triggers sort=date", async () => {
            await connectionConfigurations.expectListRequestSucceeded(
                () =>
                    connectionConfigurations.table.sortByColumn(
                        CONNECTION_CONFIGURATION_COLUMN.date,
                    ),
                { urlMustContain: [/[?&]sort=date/i] },
            );
        });

        await test.step("items-per-page resizes the page request", async () => {
            await connectionConfigurations.goto();
            await connectionConfigurations.expectListRequestSucceeded(
                () => connectionConfigurations.table.setItemsPerPage(5),
                { urlMustContain: [/[?&]page_size=5/i] },
            );
        });

        await test.step("go to page 2 if available", async () => {
            if (await connectionConfigurations.table.hasPage(2)) {
                await connectionConfigurations.expectListRequestSucceeded(
                    () => connectionConfigurations.table.goToPage(2),
                    { urlMustContain: [/[?&]page_number=2/i] },
                );
            }
        });
    });

    test("D shows error UI when the list request fails with 500", async ({
        connectionConfigurations,
    }) => {
        await connectionConfigurations.page.route(
            /\/client_configuration(?:\?|$)/i,
            (route) =>
                route.fulfill({
                    status: 500,
                    contentType: "application/json",
                    body: JSON.stringify({
                        message: "Internal Server Error (forced by Playwright)",
                    }),
                }),
        );

        await connectionConfigurations.page.goto(
            connectionConfigurations.config.route,
        );
        await expect(
            connectionConfigurations.page.getByText(/Something went wrong:/i),
        ).toBeVisible();
    });

    test("E row actions open confirm dialogs and cancel leaves data unchanged", async ({
        connectionConfigurations,
    }) => {
        await connectionConfigurations.goto();
        await connectionConfigurations.expectListRequestSucceeded(() =>
            connectionConfigurations.search(searchName),
        );
        await connectionConfigurations.table.expectRowVisible(activeId);

        await test.step("delete button opens the delete dialog; cancel keeps the row", async () => {
            await connectionConfigurations.table.deleteButton(activeId).click();
            await connectionConfigurations.deleteDialog.expectVisible();
            await connectionConfigurations.deleteDialog.cancel();
            await connectionConfigurations.deleteDialog.expectHidden();
            await connectionConfigurations.table.expectRowVisible(activeId);
        });

        await test.step("status chip opens the status dialog; cancel keeps the status", async () => {
            await connectionConfigurations.table.statusChip(activeId).click();
            await connectionConfigurations.statusDialog.expectVisible();
            await connectionConfigurations.statusDialog.cancel();
            await connectionConfigurations.statusDialog.expectHidden();
            await connectionConfigurations.table.expectStatusText(
                activeId,
                "Active",
            );
        });
    });

    test("F restores search and filters from the URL", async ({
        connectionConfigurations,
    }) => {
        await connectionConfigurations.page.goto(
            `/connection-configuration?search=${encodeURIComponent(searchName)}&status=Inactive`,
        );

        await connectionConfigurations.searchBar.expectInputValue(searchName);
        await connectionConfigurations.table.expectRowVisible(inactiveId);
        await connectionConfigurations.table.expectRowAbsent(activeId);
    });

    test("G shows the empty state when nothing matches", async ({
        connectionConfigurations,
    }) => {
        await connectionConfigurations.goto();
        await connectionConfigurations.expectListRequestSucceeded(() =>
            connectionConfigurations.search(
                "zzz-no-such-connection-config-000",
            ),
        );
        await expect(
            connectionConfigurations.page.getByText("No Data Available"),
        ).toBeVisible();
    });

    test("H add button navigates to the create page", async ({
        connectionConfigurations,
    }) => {
        await connectionConfigurations.goto();
        await connectionConfigurations.layout.addButton.click();
        await expect(connectionConfigurations.page).toHaveURL(
            /\/connection-configuration\/create/,
        );
    });
});
