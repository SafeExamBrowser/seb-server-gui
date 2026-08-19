import { expect, test } from "../shared/fixtures/table-list-fixtures";
import { EXAM_COLUMN } from "./models/exams-list.model";

const searchName = "e2e-getall-exam";
const upcomingId = 9201;
const runningId = 9203;
const finishedByodId = 9204;
const finishedUndefinedId = 9206;

test.describe("06 Exams - READ Get All", () => {
    test("A searches by name and shows the matching row", async ({ exams }) => {
        await test.step("open list page", async () => {
            await exams.goto();
            expect(exams.page.url()).toContain("/exam");
        });

        await test.step("search by name triggers list request", async () => {
            await exams.expectListRequestSucceeded(
                () => exams.search(`${searchName}-01`),
                {
                    urlMustContain: [
                        /[?&]quizName=/i,
                        encodeURIComponent(`${searchName}-01`),
                    ],
                },
            );
        });

        await test.step("the seeded exam row is visible", async () => {
            await exams.table.expectRowVisible(upcomingId);
        });
    });

    test("B filters by status and type", async ({ exams }) => {
        await exams.goto();
        await exams.expectListRequestSucceeded(() => exams.search(searchName));
        await exams.table.expectRowVisible(upcomingId);

        await test.step("status=RUNNING narrows to the running exam", async () => {
            await exams.expectListRequestSucceeded(
                () => exams.toggleStatusFilter("RUNNING"),
                { urlMustContain: [/[?&]status=RUNNING/i] },
            );
            await exams.table.expectRowVisible(runningId);
            await exams.table.expectRowAbsent(upcomingId);
        });

        await test.step("status=FINISHED shows both finished exams", async () => {
            await exams.expectListRequestSucceeded(() =>
                exams.toggleStatusFilter("RUNNING"),
            );
            await exams.expectListRequestSucceeded(
                () => exams.toggleStatusFilter("FINISHED"),
                { urlMustContain: [/[?&]status=FINISHED/i] },
            );
            await exams.table.expectRowVisible(finishedByodId);
            await exams.table.expectRowVisible(finishedUndefinedId);
            await exams.table.expectRowAbsent(runningId);
        });

        await test.step("type=BYOD (multi-select) narrows within the status filter", async () => {
            await exams.expectListRequestSucceeded(
                () => exams.toggleTypeFilter("BYOD"),
                { urlMustContain: [/[?&]type=BYOD/i] },
            );
            await exams.table.expectRowVisible(finishedByodId);
            await exams.table.expectRowAbsent(finishedUndefinedId);
        });

        await test.step("clearAll resets search and filters", async () => {
            await exams.clearSearchAndFilters();
            await exams.searchBar.expectInputEmpty();
            await expect(exams.searchBar.clearAllButton).toBeHidden();
        });
    });

    test("C sorts and paginates", async ({ exams }) => {
        await exams.goto();
        await exams.expectListRequestSucceeded(() => exams.search(searchName));
        await exams.table.expectRowVisible(upcomingId);

        await test.step("sort by Name ascending triggers sort=quizName", async () => {
            await exams.expectListRequestSucceeded(
                () => exams.table.sortByColumn(EXAM_COLUMN.name),
                { urlMustContain: [/[?&]sort=quizName(?:&|$)/i] },
            );
        });

        await test.step("sort by Name again triggers descending sort=-quizName", async () => {
            await exams.expectListRequestSucceeded(
                () => exams.table.sortByColumn(EXAM_COLUMN.name),
                { urlMustContain: [/[?&]sort=-quizName/i] },
            );
        });

        await test.step("items-per-page resizes the page request (when it is a change)", async () => {
            await exams.goto();
            if ((await exams.table.currentItemsPerPage()) !== 5) {
                await exams.expectListRequestSucceeded(
                    () => exams.table.setItemsPerPage(5),
                    { urlMustContain: [/[?&]page_size=5/i] },
                );
            }
        });

        await test.step("go to page 2 if available", async () => {
            if (await exams.table.hasPage(2)) {
                await exams.expectListRequestSucceeded(
                    () => exams.table.goToPage(2),
                    { urlMustContain: [/[?&]page_number=2/i] },
                );
            }
        });
    });

    test("D shows error UI when the list request fails with 500", async ({
        exams,
    }) => {
        await exams.page.route(/\/api\/exam(?:$|\?)/i, (route) =>
            route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({
                    message: "Internal Server Error (forced by Playwright)",
                }),
            }),
        );

        await exams.page.goto(exams.config.route);
        await expect(
            exams.page.getByText(/Something went wrong:/i),
        ).toBeVisible();
    });

    test("E row click and the navigate action both open the exam detail page", async ({
        exams,
    }) => {
        await exams.goto();
        await exams.expectListRequestSucceeded(() => exams.search(searchName));
        await exams.table.expectRowVisible(upcomingId);

        await test.step("navigate action button opens the detail page", async () => {
            await exams.navigateButton(upcomingId).click();
            await expect(exams.page).toHaveURL(
                new RegExp(`/exam/${upcomingId}$`),
            );
        });

        await test.step("clicking the row itself also navigates", async () => {
            await exams.page.goto(exams.config.route);
            await exams.expectListRequestSucceeded(() =>
                exams.search(searchName),
            );
            await exams.table.row(runningId).click();
            await expect(exams.page).toHaveURL(
                new RegExp(`/exam/${runningId}$`),
            );
        });
    });

    test("F restores search and filters from the URL", async ({ exams }) => {
        await exams.page.goto(
            `/exam?search=${encodeURIComponent(searchName)}&status=RUNNING`,
        );

        await exams.searchBar.expectInputValue(searchName);
        await exams.table.expectRowVisible(runningId);
        await exams.table.expectRowAbsent(upcomingId);
    });

    test("G shows the empty state when nothing matches", async ({ exams }) => {
        await exams.goto();
        await exams.expectListRequestSucceeded(() =>
            exams.search("zzz-no-such-exam-000"),
        );
        await expect(exams.page.getByText("No Data Available")).toBeVisible();
    });

    test("H add button navigates to the create page", async ({ exams }) => {
        await exams.goto();
        await exams.layout.addButton.click();
        await expect(exams.page).toHaveURL(/\/exam\/create/);
    });
});
