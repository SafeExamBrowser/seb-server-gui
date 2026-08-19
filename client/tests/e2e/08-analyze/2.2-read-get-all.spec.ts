import { expect, test } from "../shared/fixtures/table-list-fixtures";
import { waitForRequest } from "../utils/networkAssertions";
import { ANALYZE_COLUMN } from "./models/analyze-list.model";

// The finishedexams resource only ever contains finished/archived exams
// (see mock-backend.ts FINISHED_EXAMS), independent of any status filter.
const searchName = "e2e-getall-exam";
const finishedSpsId = 9204;
const archivedId = 9205;
const finishedUndefinedId = 9206;

test.describe("08 Analyze - READ Get All", () => {
    test("A searches by name and shows the matching row", async ({
        analyzeExams,
    }) => {
        await test.step("open list page", async () => {
            await analyzeExams.goto();
            expect(analyzeExams.page.url()).toContain("/analyze");
        });

        await test.step("search by name triggers list request", async () => {
            await analyzeExams.expectListRequestSucceeded(
                () => analyzeExams.search(`${searchName}-04`),
                {
                    urlMustContain: [
                        /[?&]quizName=/i,
                        encodeURIComponent(`${searchName}-04`),
                    ],
                },
            );
        });

        await test.step("the seeded finished exam row is visible", async () => {
            await analyzeExams.table.expectRowVisible(finishedSpsId);
        });
    });

    test("B filters by status and type", async ({ analyzeExams }) => {
        await analyzeExams.goto();
        await analyzeExams.expectListRequestSucceeded(() =>
            analyzeExams.search(searchName),
        );
        await analyzeExams.table.expectRowVisible(finishedSpsId);
        await analyzeExams.table.expectRowVisible(archivedId);
        await analyzeExams.table.expectRowVisible(finishedUndefinedId);

        await test.step("status=ARCHIVED narrows to the archived exam", async () => {
            await analyzeExams.expectListRequestSucceeded(
                () => analyzeExams.toggleStatusFilter("ARCHIVED"),
                { urlMustContain: [/[?&]status=ARCHIVED/i] },
            );
            await analyzeExams.table.expectRowVisible(archivedId);
            await analyzeExams.table.expectRowAbsent(finishedSpsId);
        });

        await test.step("status=FINISHED shows both finished exams", async () => {
            await analyzeExams.expectListRequestSucceeded(
                () => analyzeExams.toggleStatusFilter("FINISHED"),
                { urlMustContain: [/[?&]status=FINISHED/i] },
            );
            await analyzeExams.table.expectRowVisible(finishedSpsId);
            await analyzeExams.table.expectRowVisible(finishedUndefinedId);
            await analyzeExams.table.expectRowAbsent(archivedId);
        });

        await test.step("type=UNDEFINED (multi-select) narrows within the status filter", async () => {
            await analyzeExams.expectListRequestSucceeded(
                () => analyzeExams.toggleTypeFilter("UNDEFINED"),
                { urlMustContain: [/[?&]type=UNDEFINED/i] },
            );
            await analyzeExams.table.expectRowVisible(finishedUndefinedId);
            await analyzeExams.table.expectRowAbsent(finishedSpsId);
        });

        await test.step("clearAll resets search and filters", async () => {
            await analyzeExams.clearSearchAndFilters();
            await analyzeExams.searchBar.expectInputEmpty();
            await expect(analyzeExams.searchBar.clearAllButton).toBeHidden();
        });
    });

    test("C sorts and paginates", async ({ analyzeExams }) => {
        await analyzeExams.goto();
        await analyzeExams.expectListRequestSucceeded(() =>
            analyzeExams.search(searchName),
        );
        await analyzeExams.table.expectRowVisible(finishedSpsId);

        await test.step("sort by Name ascending triggers sort=quizName", async () => {
            await analyzeExams.expectListRequestSucceeded(
                () => analyzeExams.table.sortByColumn(ANALYZE_COLUMN.name),
                { urlMustContain: [/[?&]sort=quizName(?:&|$)/i] },
            );
        });

        await test.step("sort by Name again triggers descending sort=-quizName", async () => {
            await analyzeExams.expectListRequestSucceeded(
                () => analyzeExams.table.sortByColumn(ANALYZE_COLUMN.name),
                { urlMustContain: [/[?&]sort=-quizName/i] },
            );
        });

        await test.step("items-per-page resizes the page request (when it is a change)", async () => {
            await analyzeExams.goto();
            if ((await analyzeExams.table.currentItemsPerPage()) !== 5) {
                await analyzeExams.expectListRequestSucceeded(
                    () => analyzeExams.table.setItemsPerPage(5),
                    { urlMustContain: [/[?&]page_size=5/i] },
                );
            }
        });

        await test.step("go to page 2 if available", async () => {
            if (await analyzeExams.table.hasPage(2)) {
                await analyzeExams.expectListRequestSucceeded(
                    () => analyzeExams.table.goToPage(2),
                    { urlMustContain: [/[?&]page_number=2/i] },
                );
            }
        });
    });

    test("D shows error UI when the list request fails with 500", async ({
        analyzeExams,
    }) => {
        await analyzeExams.page.route(
            /\/api\/monitoring\/finishedexams(?:$|\?)/i,
            (route) =>
                route.fulfill({
                    status: 500,
                    contentType: "application/json",
                    body: JSON.stringify({
                        message: "Internal Server Error (forced by Playwright)",
                    }),
                }),
        );

        await analyzeExams.page.goto(analyzeExams.config.route);
        await expect(
            analyzeExams.page.getByText(/Something went wrong:/i),
        ).toBeVisible();
    });

    test("E row actions: showSPS is conditional, downloadSEBLogs always fires the export request", async ({
        analyzeExams,
    }) => {
        await analyzeExams.goto();
        await analyzeExams.expectListRequestSucceeded(() =>
            analyzeExams.search(searchName),
        );
        await analyzeExams.table.expectRowVisible(finishedSpsId);
        await analyzeExams.table.expectRowVisible(archivedId);

        await test.step("showSPS is only visible on the row with screen proctoring enabled", async () => {
            await expect(
                analyzeExams.showScreenProctoringButton(finishedSpsId),
            ).toBeVisible();
            await expect(
                analyzeExams.showScreenProctoringButton(archivedId),
            ).toHaveCount(0);
        });

        await test.step("showSPS navigates to the screen proctoring search", async () => {
            await analyzeExams
                .showScreenProctoringButton(finishedSpsId)
                .click();
            await expect(analyzeExams.page).toHaveURL(/\/sp-search\?/);
        });

        await test.step("downloadSEBLogs fires the CSV export request", async () => {
            await analyzeExams.page.goto(analyzeExams.config.route);
            await analyzeExams.expectListRequestSucceeded(() =>
                analyzeExams.search(searchName),
            );

            const requestPromise = waitForRequest(
                analyzeExams.page,
                "GET",
                /\/api\/seb-client-event\/export(?:$|\?)/i,
            );
            await analyzeExams.downloadSebLogsButton(archivedId).click();
            const request = await requestPromise;
            expect(request.url()).toMatch(new RegExp(`examId=${archivedId}`));
        });
    });

    test("F restores search and filters from the URL", async ({
        analyzeExams,
    }) => {
        await analyzeExams.page.goto(
            `/analyze?search=${encodeURIComponent(searchName)}&status=ARCHIVED`,
        );

        await analyzeExams.searchBar.expectInputValue(searchName);
        await analyzeExams.table.expectRowVisible(archivedId);
        await analyzeExams.table.expectRowAbsent(finishedSpsId);
    });

    test("G shows the empty state when nothing matches", async ({
        analyzeExams,
    }) => {
        await analyzeExams.goto();
        await analyzeExams.expectListRequestSucceeded(() =>
            analyzeExams.search("zzz-no-such-exam-000"),
        );
        await expect(
            analyzeExams.page.getByText("No Data Available"),
        ).toBeVisible();
    });
});
