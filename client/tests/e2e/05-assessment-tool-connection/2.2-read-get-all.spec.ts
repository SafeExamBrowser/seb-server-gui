import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { ASSESSMENT_TOOL_COLUMN } from "@/pages/(app)/assessment-tool/assessmentToolListConfig.ts";

const searchName = "e2e-getall-assessment-tool";
const activeId = 9101;
const inactiveId = 9102;
const institutionModelId = 11;

test.describe("05 Assessment Tools - READ Get All", () => {
    test("A searches by name and shows the matching rows", async ({
        assessmentTools,
    }) => {
        await test.step("open list page", async () => {
            await assessmentTools.goto();
            expect(assessmentTools.page.url()).toContain("/assessment-tool");
        });

        await test.step("search triggers a list request carrying name=", async () => {
            await assessmentTools.expectListRequestSucceeded(
                () => assessmentTools.search(searchName),
                {
                    urlMustContain: [
                        /[?&]name=/i,
                        encodeURIComponent(searchName),
                    ],
                },
            );
        });

        await test.step("active and inactive seeded rows are visible", async () => {
            await assessmentTools.table.expectRowVisible(activeId);
            await assessmentTools.table.expectRowVisible(inactiveId);
        });
    });

    test("B filters by status and (when available) institution", async ({
        assessmentTools,
    }) => {
        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search(searchName),
        );
        await assessmentTools.table.expectRowVisible(activeId);
        await assessmentTools.table.expectRowVisible(inactiveId);

        await test.step("inactive filter shows only the inactive row", async () => {
            await assessmentTools.expectListRequestSucceeded(
                () => assessmentTools.toggleStatusFilter("Inactive"),
                { urlMustContain: [/[?&]active=false/i] },
            );
            await assessmentTools.table.expectRowVisible(inactiveId);
            await assessmentTools.table.expectRowAbsent(activeId);
        });

        await test.step("active filter shows only the active row", async () => {
            await assessmentTools.expectListRequestSucceeded(
                () => assessmentTools.toggleStatusFilter("Active"),
                { urlMustContain: [/[?&]active=true/i] },
            );
            await assessmentTools.table.expectRowVisible(activeId);
            await assessmentTools.table.expectRowAbsent(inactiveId);
        });

        await test.step("institution filter (if visible) narrows by institution", async () => {
            if (await assessmentTools.hasInstitutionFilter()) {
                await assessmentTools.expectInstitutionFilterVisible();
                await assessmentTools.expectListRequestSucceeded(
                    () =>
                        assessmentTools.toggleInstitutionFilter(
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
                await assessmentTools.table.expectVisible();
            } else {
                await assessmentTools.expectInstitutionFilterAbsent();
            }
        });

        await test.step("clearAll resets search and filters", async () => {
            await assessmentTools.clearSearchAndFilters();
            await assessmentTools.searchBar.expectInputEmpty();
            await expect(assessmentTools.searchBar.clearAllButton).toBeHidden();
        });
    });

    test("C sorts and paginates", async ({ assessmentTools }) => {
        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search(searchName),
        );
        await assessmentTools.table.expectRowVisible(activeId);

        await test.step("sort by Name ascending triggers sort=name", async () => {
            await assessmentTools.expectListRequestSucceeded(
                () =>
                    assessmentTools.table.sortByColumn(
                        ASSESSMENT_TOOL_COLUMN.name,
                    ),
                { urlMustContain: [/[?&]sort=name(?:&|$)/i] },
            );
        });

        await test.step("sort by Name again triggers descending sort=-name", async () => {
            await assessmentTools.expectListRequestSucceeded(
                () =>
                    assessmentTools.table.sortByColumn(
                        ASSESSMENT_TOOL_COLUMN.name,
                    ),
                { urlMustContain: [/[?&]sort=-name/i] },
            );
        });

        await test.step("items-per-page resizes the page request", async () => {
            await assessmentTools.goto();
            await assessmentTools.expectListRequestSucceeded(
                () => assessmentTools.table.setItemsPerPage(5),
                { urlMustContain: [/[?&]page_size=5/i] },
            );
        });

        await test.step("go to page 2 if available", async () => {
            if (await assessmentTools.table.hasPage(2)) {
                await assessmentTools.expectListRequestSucceeded(
                    () => assessmentTools.table.goToPage(2),
                    { urlMustContain: [/[?&]page_number=2/i] },
                );
            }
        });
    });

    test("D shows error UI when the list request fails with 500", async ({
        assessmentTools,
    }) => {
        await assessmentTools.page.route(/\/lms-setup\?/i, (route) =>
            route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({
                    message: "Internal Server Error (forced by Playwright)",
                }),
            }),
        );

        await assessmentTools.page.goto(assessmentTools.config.route);
        await expect(
            assessmentTools.page.getByText(/Something went wrong:/i),
        ).toBeVisible();
    });

    test("E row actions open confirm dialogs and cancel leaves data unchanged", async ({
        assessmentTools,
    }) => {
        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search(searchName),
        );
        await assessmentTools.table.expectRowVisible(activeId);

        await test.step("delete button opens the delete dialog; cancel keeps the row", async () => {
            await assessmentTools.table.deleteButton(activeId).click();
            await assessmentTools.deleteDialog.expectVisible();
            await assessmentTools.deleteDialog.cancel();
            await assessmentTools.deleteDialog.expectHidden();
            await assessmentTools.table.expectRowVisible(activeId);
        });

        await test.step("status chip opens the status dialog; cancel keeps the status", async () => {
            await assessmentTools.table.statusChip(activeId).click();
            await assessmentTools.statusDialog.expectVisible();
            await assessmentTools.statusDialog.cancel();
            await assessmentTools.statusDialog.expectHidden();
            await assessmentTools.table.expectStatusText(activeId, "Active");
        });
    });

    test("F restores search and filters from the URL", async ({
        assessmentTools,
    }) => {
        await assessmentTools.page.goto(
            `/assessment-tool?search=${encodeURIComponent(searchName)}&status=Inactive`,
        );

        await assessmentTools.searchBar.expectInputValue(searchName);
        await assessmentTools.table.expectRowVisible(inactiveId);
        await assessmentTools.table.expectRowAbsent(activeId);
    });

    test("G shows the empty state when nothing matches", async ({
        assessmentTools,
    }) => {
        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search("zzz-no-such-assessment-tool-000"),
        );
        await expect(
            assessmentTools.page.getByText("No Data Available"),
        ).toBeVisible();
    });

    test("H add button navigates to the create page", async ({
        assessmentTools,
    }) => {
        await assessmentTools.goto();
        await assessmentTools.layout.addButton.click();
        await expect(assessmentTools.page).toHaveURL(
            /\/assessment-tool\/create/,
        );
    });
});
