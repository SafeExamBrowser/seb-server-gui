import { expect, test } from "../shared/fixtures/table-list-fixtures";
import { MONITORING_COLUMN } from "./models/monitoring-list.model";

const searchName = "e2e-getall-exam";
const testRunId = 9202;
const runningId = 9203;

test.describe("07 Monitoring - READ Get All", () => {
    test("A searches by name and shows the matching row", async ({
        monitoringExams,
    }) => {
        await test.step("open list page", async () => {
            await monitoringExams.goto();
            expect(monitoringExams.page.url()).toContain("/monitoring");
        });

        await test.step("search by name triggers list request", async () => {
            await monitoringExams.expectListRequestSucceeded(
                () => monitoringExams.search(`${searchName}-03`),
                {
                    urlMustContain: [
                        /[?&]quizName=/i,
                        encodeURIComponent(`${searchName}-03`),
                    ],
                },
            );
        });

        await test.step("the running seeded exam row is visible", async () => {
            await monitoringExams.table.expectRowVisible(runningId);
        });
    });

    test("B filters by status and type", async ({ monitoringExams }) => {
        await monitoringExams.goto();
        await monitoringExams.expectListRequestSucceeded(() =>
            monitoringExams.search(searchName),
        );
        await monitoringExams.table.expectRowVisible(testRunId);
        await monitoringExams.table.expectRowVisible(runningId);

        await test.step("status=TEST_RUN narrows to the test-run exam", async () => {
            await monitoringExams.expectListRequestSucceeded(
                () => monitoringExams.toggleStatusFilter("TEST_RUN"),
                { urlMustContain: [/[?&]status=TEST_RUN/i] },
            );
            await monitoringExams.table.expectRowVisible(testRunId);
            await monitoringExams.table.expectRowAbsent(runningId);
        });

        await test.step("status=RUNNING narrows to the running exam", async () => {
            await monitoringExams.expectListRequestSucceeded(
                () => monitoringExams.toggleStatusFilter("RUNNING"),
                { urlMustContain: [/[?&]status=RUNNING/i] },
            );
            await monitoringExams.table.expectRowVisible(runningId);
            await monitoringExams.table.expectRowAbsent(testRunId);
        });

        await test.step("type=VDI (multi-select) keeps the matching row", async () => {
            await monitoringExams.expectListRequestSucceeded(
                () => monitoringExams.toggleTypeFilter("VDI"),
                { urlMustContain: [/[?&]type=VDI/i] },
            );
            await monitoringExams.table.expectRowVisible(runningId);
        });

        await test.step("clearAll resets search and filters", async () => {
            await monitoringExams.clearSearchAndFilters();
            await monitoringExams.searchBar.expectInputEmpty();
            await expect(monitoringExams.searchBar.clearAllButton).toBeHidden();
        });
    });

    test("C sorts and paginates", async ({ monitoringExams }) => {
        await monitoringExams.goto();
        await monitoringExams.expectListRequestSucceeded(() =>
            monitoringExams.search(searchName),
        );
        await monitoringExams.table.expectRowVisible(runningId);

        await test.step("sort by Name ascending triggers sort=quizName", async () => {
            await monitoringExams.expectListRequestSucceeded(
                () =>
                    monitoringExams.table.sortByColumn(MONITORING_COLUMN.name),
                { urlMustContain: [/[?&]sort=quizName(?:&|$)/i] },
            );
        });

        await test.step("sort by Name again triggers descending sort=-quizName", async () => {
            await monitoringExams.expectListRequestSucceeded(
                () =>
                    monitoringExams.table.sortByColumn(MONITORING_COLUMN.name),
                { urlMustContain: [/[?&]sort=-quizName/i] },
            );
        });

        await test.step("items-per-page resizes the page request (when it is a change)", async () => {
            await monitoringExams.goto();
            if ((await monitoringExams.table.currentItemsPerPage()) !== 5) {
                await monitoringExams.expectListRequestSucceeded(
                    () => monitoringExams.table.setItemsPerPage(5),
                    { urlMustContain: [/[?&]page_size=5/i] },
                );
            }
        });

        await test.step("go to page 2 if available", async () => {
            if (await monitoringExams.table.hasPage(2)) {
                await monitoringExams.expectListRequestSucceeded(
                    () => monitoringExams.table.goToPage(2),
                    { urlMustContain: [/[?&]page_number=2/i] },
                );
            }
        });
    });

    test("D shows error UI when the list request fails with 500", async ({
        monitoringExams,
    }) => {
        await monitoringExams.page.route(
            /\/api\/monitoring(?:$|\?)/i,
            (route) =>
                route.fulfill({
                    status: 500,
                    contentType: "application/json",
                    body: JSON.stringify({
                        message: "Internal Server Error (forced by Playwright)",
                    }),
                }),
        );

        await monitoringExams.page.goto(monitoringExams.config.route);
        await expect(
            monitoringExams.page.getByText(/Something went wrong:/i),
        ).toBeVisible();
    });

    test("E row click and the navigate action both open the monitoring detail page", async ({
        monitoringExams,
    }) => {
        await monitoringExams.goto();
        await monitoringExams.expectListRequestSucceeded(() =>
            monitoringExams.search(searchName),
        );
        await monitoringExams.table.expectRowVisible(runningId);

        await test.step("navigate action button opens the detail page", async () => {
            await monitoringExams.navigateButton(runningId).click();
            await expect(monitoringExams.page).toHaveURL(
                new RegExp(`/monitoring/${runningId}$`),
            );
        });

        await test.step("clicking the row itself also navigates", async () => {
            await monitoringExams.page.goto(monitoringExams.config.route);
            await monitoringExams.expectListRequestSucceeded(() =>
                monitoringExams.search(searchName),
            );
            await monitoringExams.table.row(testRunId).click();
            await expect(monitoringExams.page).toHaveURL(
                new RegExp(`/monitoring/${testRunId}$`),
            );
        });
    });

    test("F restores search and filters from the URL", async ({
        monitoringExams,
    }) => {
        await monitoringExams.page.goto(
            `/monitoring?search=${encodeURIComponent(searchName)}&status=TEST_RUN`,
        );

        await monitoringExams.searchBar.expectInputValue(searchName);
        await monitoringExams.table.expectRowVisible(testRunId);
        await monitoringExams.table.expectRowAbsent(runningId);
    });

    test("G shows the empty state when nothing matches", async ({
        monitoringExams,
    }) => {
        await monitoringExams.goto();
        await monitoringExams.expectListRequestSucceeded(() =>
            monitoringExams.search("zzz-no-such-exam-000"),
        );
        await expect(
            monitoringExams.page.getByText("No Data Available"),
        ).toBeVisible();
    });
});
