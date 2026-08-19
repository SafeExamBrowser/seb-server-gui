import { expect, test } from "../shared/fixtures/table-list-fixtures";
import { expectNoRequest } from "../utils/networkAssertions";
import { ARCHIVE_COLUMN } from "./models/archive-list.model";

// useArchiveExams.ts defaults status to "ARCHIVED,FINISHED,RUNNING" whenever
// no status filter is selected, so the up-coming/test-run seeded exams are
// never visible here without an explicit (and irrelevant) filter.
const searchName = "e2e-getall-exam";
const finishedSpsId = 9204;
const archivedId = 9205;
const finishedUndefinedId = 9206;

test.describe("09 Archive - READ Get All", () => {
    test("A searches by name and shows the matching row", async ({
        archiveExams,
    }) => {
        await test.step("open list page", async () => {
            await archiveExams.goto();
            expect(archiveExams.page.url()).toContain("/archive");
        });

        await test.step("search by name triggers list request", async () => {
            await archiveExams.expectListRequestSucceeded(
                () => archiveExams.search(`${searchName}-05`),
                {
                    urlMustContain: [
                        /[?&]quizName=/i,
                        encodeURIComponent(`${searchName}-05`),
                    ],
                },
            );
        });

        await test.step("the seeded archived exam row is visible", async () => {
            await archiveExams.table.expectRowVisible(archivedId);
        });
    });

    test("B filters by status and type", async ({ archiveExams }) => {
        await archiveExams.goto();
        await archiveExams.expectListRequestSucceeded(() =>
            archiveExams.search(searchName),
        );
        await archiveExams.table.expectRowVisible(archivedId);
        await archiveExams.table.expectRowVisible(finishedSpsId);

        await test.step("status=ARCHIVED narrows to the archived exam", async () => {
            await archiveExams.expectListRequestSucceeded(
                () => archiveExams.toggleStatusFilter("ARCHIVED"),
                { urlMustContain: [/[?&]status=ARCHIVED/i] },
            );
            await archiveExams.table.expectRowVisible(archivedId);
            await archiveExams.table.expectRowAbsent(finishedSpsId);
        });

        await test.step("status=FINISHED shows both finished exams", async () => {
            await archiveExams.expectListRequestSucceeded(
                () => archiveExams.toggleStatusFilter("FINISHED"),
                { urlMustContain: [/[?&]status=FINISHED/i] },
            );
            await archiveExams.table.expectRowVisible(finishedSpsId);
            await archiveExams.table.expectRowVisible(finishedUndefinedId);
            await archiveExams.table.expectRowAbsent(archivedId);
        });

        await test.step("type=BYOD (multi-select) narrows within the status filter", async () => {
            await archiveExams.expectListRequestSucceeded(
                () => archiveExams.toggleTypeFilter("BYOD"),
                { urlMustContain: [/[?&]type=BYOD/i] },
            );
            await archiveExams.table.expectRowVisible(finishedSpsId);
            await archiveExams.table.expectRowAbsent(finishedUndefinedId);
        });

        await test.step("clearAll resets search and filters", async () => {
            await archiveExams.clearSearchAndFilters();
            await archiveExams.searchBar.expectInputEmpty();
            await expect(archiveExams.searchBar.clearAllButton).toBeHidden();
        });
    });

    test("C sorts and paginates", async ({ archiveExams }) => {
        await archiveExams.goto();
        await archiveExams.expectListRequestSucceeded(() =>
            archiveExams.search(searchName),
        );
        await archiveExams.table.expectRowVisible(archivedId);

        await test.step("sort by Name ascending triggers sort=quizName", async () => {
            await archiveExams.expectListRequestSucceeded(
                () => archiveExams.table.sortByColumn(ARCHIVE_COLUMN.name),
                { urlMustContain: [/[?&]sort=quizName(?:&|$)/i] },
            );
        });

        await test.step("sort by Name again triggers descending sort=-quizName", async () => {
            await archiveExams.expectListRequestSucceeded(
                () => archiveExams.table.sortByColumn(ARCHIVE_COLUMN.name),
                { urlMustContain: [/[?&]sort=-quizName/i] },
            );
        });

        await test.step("items-per-page resizes the page request (when it is a change)", async () => {
            await archiveExams.goto();
            if ((await archiveExams.table.currentItemsPerPage()) !== 5) {
                await archiveExams.expectListRequestSucceeded(
                    () => archiveExams.table.setItemsPerPage(5),
                    { urlMustContain: [/[?&]page_size=5/i] },
                );
            }
        });

        await test.step("go to page 2 if available", async () => {
            if (await archiveExams.table.hasPage(2)) {
                await archiveExams.expectListRequestSucceeded(
                    () => archiveExams.table.goToPage(2),
                    { urlMustContain: [/[?&]page_number=2/i] },
                );
            }
        });
    });

    test("D shows error UI when the list request fails with 500", async ({
        archiveExams,
    }) => {
        await archiveExams.page.route(/\/api\/exam(?:$|\?)/i, (route) =>
            route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({
                    message: "Internal Server Error (forced by Playwright)",
                }),
            }),
        );

        await archiveExams.page.goto(archiveExams.config.route);
        await expect(
            archiveExams.page.getByText(/Something went wrong:/i),
        ).toBeVisible();
    });

    test("E archive action is hidden for already-archived rows; cancel leaves status unchanged", async ({
        archiveExams,
    }) => {
        await archiveExams.goto();
        await archiveExams.expectListRequestSucceeded(() =>
            archiveExams.search(searchName),
        );
        await archiveExams.table.expectRowVisible(archivedId);
        await archiveExams.table.expectRowVisible(finishedSpsId);

        await test.step("archive action is hidden on the already-archived row", async () => {
            await expect(archiveExams.archiveButton(archivedId)).toHaveCount(0);
            await expect(
                archiveExams.archiveButton(finishedSpsId),
            ).toBeVisible();
        });

        await test.step("archive action opens the confirm dialog; cancel fires no request and keeps the row", async () => {
            await archiveExams.archiveButton(finishedSpsId).click();
            await archiveExams.expectArchiveDialogVisible();

            await expectNoRequest({
                page: archiveExams.page,
                method: "PATCH",
                urlRegex: new RegExp(`/api/exam/${finishedSpsId}/archive`),
                action: () => archiveExams.archiveDialogCancelButton().click(),
            });

            await archiveExams.expectArchiveDialogHidden();
            await archiveExams.table.expectRowVisible(finishedSpsId);
            await expect(
                archiveExams.archiveButton(finishedSpsId),
            ).toBeVisible();
        });
    });

    test("F restores search and filters from the URL", async ({
        archiveExams,
    }) => {
        await archiveExams.page.goto(
            `/archive?search=${encodeURIComponent(searchName)}&status=ARCHIVED`,
        );

        await archiveExams.searchBar.expectInputValue(searchName);
        await archiveExams.table.expectRowVisible(archivedId);
        await archiveExams.table.expectRowAbsent(finishedSpsId);
    });

    test("G shows the empty state when nothing matches", async ({
        archiveExams,
    }) => {
        await archiveExams.goto();
        await archiveExams.expectListRequestSucceeded(() =>
            archiveExams.search("zzz-no-such-exam-000"),
        );
        await expect(
            archiveExams.page.getByText("No Data Available"),
        ).toBeVisible();
    });
});
