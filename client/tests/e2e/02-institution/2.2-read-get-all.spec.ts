import { INSTITUTION_COLUMN } from "@/pages/(app)/institution/institutionListConfig.ts";

import { expect, test } from "../shared/fixtures/table-list-fixtures";

const searchName = "Test";
const inactiveInstitutionId = 12;
const activeInstitutionId = 11;

test.describe("02 Institutions - READ Get All", () => {
    test("A searches by name and shows the matching row", async ({
        institutions,
    }) => {
        await test.step("open list page", async () => {
            await institutions.goto();
            expect(institutions.page.url()).toContain("/institution");
        });

        await test.step("search by name triggers list request", async () => {
            await institutions.expectListRequestSucceeded(
                () => institutions.search(searchName),
                {
                    urlMustContain: [
                        /[?&]name=/i,
                        encodeURIComponent(searchName),
                    ],
                },
            );
        });

        await test.step("seeded inactive 'Test Institution' row is visible", async () => {
            await institutions.table.expectRowVisible(inactiveInstitutionId);
        });
    });

    test("B filters by status", async ({ institutions }) => {
        await institutions.goto();

        await test.step("inactive filter shows row 12 and hides row 11", async () => {
            await institutions.expectListRequestSucceeded(
                () => institutions.toggleStatusFilter("Inactive"),
                { urlMustContain: [/[?&]active=false/i] },
            );
            await institutions.table.expectRowVisible(inactiveInstitutionId);
            await institutions.table.expectRowAbsent(activeInstitutionId);
        });

        await test.step("active filter shows row 11 and hides row 12", async () => {
            await institutions.expectListRequestSucceeded(
                () => institutions.toggleStatusFilter("Active"),
                { urlMustContain: [/[?&]active=true/i] },
            );
            await institutions.table.expectRowVisible(activeInstitutionId);
            await institutions.table.expectRowAbsent(inactiveInstitutionId);
        });

        await test.step("clearAll resets search and filters", async () => {
            await institutions.clearSearchAndFilters();
            await institutions.searchBar.expectInputEmpty();
            await expect(institutions.searchBar.clearAllButton).toBeHidden();
        });
    });

    test("C sorts and paginates", async ({ institutions }) => {
        await institutions.goto();

        await test.step("sort by Name ascending triggers sort=name", async () => {
            await institutions.expectListRequestSucceeded(
                () => institutions.table.sortByColumn(INSTITUTION_COLUMN.name),
                { urlMustContain: [/[?&]sort=name(?:&|$)/i] },
            );
        });

        await test.step("sort by Name again triggers descending sort=-name", async () => {
            await institutions.expectListRequestSucceeded(
                () => institutions.table.sortByColumn(INSTITUTION_COLUMN.name),
                { urlMustContain: [/[?&]sort=-name/i] },
            );
        });

        await test.step("items-per-page resizes the page request (when it is a change)", async () => {
            await institutions.goto();
            // The e2e seed only guarantees 3 institutions. With so few rows
            // the table already clamps the select to 5 per page, so choosing
            // 5 would be a no-op that never fires a request.
            if ((await institutions.table.currentItemsPerPage()) !== 5) {
                await institutions.expectListRequestSucceeded(
                    () => institutions.table.setItemsPerPage(5),
                    { urlMustContain: [/[?&]page_size=5/i] },
                );
            }
        });

        await test.step("go to page 2 if available", async () => {
            if (await institutions.table.hasPage(2)) {
                await institutions.expectListRequestSucceeded(
                    () => institutions.table.goToPage(2),
                    { urlMustContain: [/[?&]page_number=2/i] },
                );
            }
        });
    });

    test("D shows error UI when the list request fails with 500", async ({
        institutions,
    }) => {
        await institutions.page.route(/\/institution\?/i, (route) =>
            route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({
                    message: "Internal Server Error (forced by Playwright)",
                }),
            }),
        );

        await institutions.page.goto(institutions.config.route);
        await expect(
            institutions.page.getByText(/Something went wrong:/i),
        ).toBeVisible();
    });

    test("E row actions open confirm dialogs and cancel leaves data unchanged", async ({
        institutions,
    }) => {
        await institutions.goto();
        await institutions.expectListRequestSucceeded(() =>
            institutions.search(searchName),
        );
        await institutions.table.expectRowVisible(inactiveInstitutionId);

        await test.step("delete button opens the delete dialog; cancel keeps the row", async () => {
            await institutions.table
                .deleteButton(inactiveInstitutionId)
                .click();
            await institutions.deleteDialog.expectVisible();
            await institutions.deleteDialog.cancel();
            await institutions.deleteDialog.expectHidden();
            await institutions.table.expectRowVisible(inactiveInstitutionId);
        });

        await test.step("status chip opens the status dialog; cancel keeps the status", async () => {
            await institutions.table.statusChip(inactiveInstitutionId).click();
            await institutions.statusDialog.expectVisible();
            await institutions.statusDialog.cancel();
            await institutions.statusDialog.expectHidden();
            await institutions.table.expectStatusText(
                inactiveInstitutionId,
                "Inactive",
            );
        });
    });

    test("F restores search and filters from the URL", async ({
        institutions,
    }) => {
        await institutions.page.goto(
            `/institution?search=${encodeURIComponent(searchName)}&status=Inactive`,
        );

        await institutions.searchBar.expectInputValue(searchName);
        await institutions.table.expectRowVisible(inactiveInstitutionId);
        await institutions.table.expectRowAbsent(activeInstitutionId);
    });

    test("G shows the empty state when nothing matches", async ({
        institutions,
    }) => {
        await institutions.goto();
        await institutions.expectListRequestSucceeded(() =>
            institutions.search("zzz-no-such-institution-000"),
        );
        await expect(
            institutions.page.getByText("No Data Available"),
        ).toBeVisible();
    });

    test("H add button navigates to the create page", async ({
        institutions,
    }) => {
        await institutions.goto();
        await institutions.layout.addButton.click();
        await expect(institutions.page).toHaveURL(/\/institution\/create/);
    });
});
