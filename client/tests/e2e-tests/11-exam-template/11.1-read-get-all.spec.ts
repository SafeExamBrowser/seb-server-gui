import { expect, test } from "../fixtures/table-list-fixtures";
import { expectNoRequest } from "../../utils/networkAssertions";

const searchName = "NadimTest1";
const upcomingId = 7;
const runningId = 9203;
const finishedByodId = 9204;
const finishedUndefinedId = 9206;

const EXAM_TYPE_NOT_DEFINED = "UNDEFINED";
const EXAM_TYPE_MANAGED_DEVICES = "MANAGED";
const EXAM_TYPE_BYOD = "BYOD";
const EXAM_TYPE_VDI = "VDI";


test.describe("11 Exam Template - READ Get All", () => {
    test("A searches by name and shows the matching row", async ({
        examTemplates,
    }) => {
        await test.step("open list page", async () => {
            await examTemplates.goto();
            expect(examTemplates.page.url()).toContain("/exam-template");
        });

        await test.step("search by name triggers list request", async () => {
            await examTemplates.expectListRequestSucceeded(
                () => examTemplates.search(`${searchName}`),
                {
                    urlMustContain: [
                        /[?&]name=/i,
                        encodeURIComponent(`${searchName}`),
                    ],
                },
            );
        });

        await test.step("the seeded exam-template row is visible", async () => {
            await examTemplates.table.expectRowVisible(upcomingId);
        });
    });

    test("B filter by exam type", async ({ examTemplates }) => {
        await examTemplates.goto();
        await examTemplates.expectListRequestSucceeded(() => examTemplates.search(searchName));
        await examTemplates.table.expectRowVisible(upcomingId);

        const escapeRegExp = (s: string) =>
            s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        await test.step("exam type = not defined", async () => {
            await examTemplates.expectListRequestSucceeded(
                () => examTemplates.toggleExamTypeFilter(EXAM_TYPE_NOT_DEFINED),
                {
                    urlMustContain: [
                        new RegExp(
                            `[?&]status=${escapeRegExp(EXAM_TYPE_NOT_DEFINED)}`,
                            "i",
                        ),
                    ],
                },
            );
            // await examTemplates.table.expectRowVisible(runningId);
            // await examTemplates.table.expectRowAbsent(upcomingId);
        });

        // await test.step("exam type = not defined", async () => {
        //     await examTemplates.expectListRequestSucceeded(() =>
        //         examTemplates.toggleStatusFilter("RUNNING"),
        //     );
        //     await examTemplates.expectListRequestSucceeded(
        //         () => examTemplates.toggleStatusFilter("FINISHED"),
        //         { urlMustContain: [/[?&]status=FINISHED/i] },
        //     );
        //     await examTemplates.table.expectRowVisible(finishedByodId);
        //     await examTemplates.table.expectRowVisible(finishedUndefinedId);
        //     await examTemplates.table.expectRowAbsent(runningId);
        // });
        //
        // await test.step("type=BYOD (multi-select) narrows within the status filter", async () => {
        //     await examTemplates.expectListRequestSucceeded(
        //         () => examTemplates.toggleTypeFilter("BYOD"),
        //         { urlMustContain: [/[?&]type=BYOD/i] },
        //     );
        //     await examTemplates.table.expectRowVisible(finishedByodId);
        //     await examTemplates.table.expectRowAbsent(finishedUndefinedId);
        // });

        await test.step("clearAll resets search and filters", async () => {
            await examTemplates.clearSearchAndFilters();
            await examTemplates.searchBar.expectInputEmpty();
            await expect(examTemplates.searchBar.clearAllButton).toBeHidden();
        });
    });

    // test("C sorts and paginates", async ({ examTemplates }) => {
    //     await examTemplates.goto();
    //     await examTemplates.expectListRequestSucceeded(() => examTemplates.search(searchName));
    //     await examTemplates.table.expectRowVisible(upcomingId);
    //
    //     await test.step("sort by Name ascending triggers sort=quizName", async () => {
    //         await examTemplates.expectListRequestSucceeded(
    //             () => examTemplates.table.sortByColumn(EXAM_COLUMN.name),
    //             { urlMustContain: [/[?&]sort=quizName(?:&|$)/i] },
    //         );
    //     });
    //
    //     await test.step("sort by Name again triggers descending sort=-quizName", async () => {
    //         await examTemplates.expectListRequestSucceeded(
    //             () => examTemplates.table.sortByColumn(EXAM_COLUMN.name),
    //             { urlMustContain: [/[?&]sort=-quizName/i] },
    //         );
    //     });
    //
    //     await test.step("items-per-page resizes the page request (when it is a change)", async () => {
    //         await examTemplates.goto();
    //         if ((await examTemplates.table.currentItemsPerPage()) !== 5) {
    //             await examTemplates.expectListRequestSucceeded(
    //                 () => examTemplates.table.setItemsPerPage(5),
    //                 { urlMustContain: [/[?&]page_size=5/i] },
    //             );
    //         }
    //     });
    //
    //     await test.step("go to page 2 if available", async () => {
    //         if (await examTemplates.table.hasPage(2)) {
    //             await examTemplates.expectListRequestSucceeded(
    //                 () => examTemplates.table.goToPage(2),
    //                 { urlMustContain: [/[?&]page_number=2/i] },
    //             );
    //         }
    //     });
    // });

    test("D shows error UI when the list request fails with 500", async ({
        examTemplates,
    }) => {
        await examTemplates.page.route(/\/api\/exam(?:$|\?)/i, (route) =>
            route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({
                    message: "Internal Server Error (forced by Playwright)",
                }),
            }),
        );

        await examTemplates.page.goto(examTemplates.config.route);
        await examTemplates.errorState.expectVisible();
    });

    test("E the navigate action opens the exam detail page, the row itself is not clickable", async ({
        examTemplates,
    }) => {
        await examTemplates.goto();
        await examTemplates.expectListRequestSucceeded(() => examTemplates.search(searchName));
        await examTemplates.table.expectRowVisible(upcomingId);

        await test.step("navigate action button opens the detail page", async () => {
            await examTemplates.navigateButton(upcomingId).click();
            await expect(examTemplates.page).toHaveURL(
                new RegExp(`/exam/${upcomingId}$`),
            );
        });

        await test.step("clicking a row with the exclude-from-deletion action does not navigate", async () => {
            await examTemplates.page.goto(examTemplates.config.route);
            await examTemplates.expectListRequestSucceeded(() =>
                examTemplates.search(searchName),
            );
            await expectNoRequest({
                page: examTemplates.page,
                method: "GET",
                urlRegex: new RegExp(`/exam/${runningId}(?:$|\\?)`),
                action: () => examTemplates.table.row(runningId).click(),
            });
            await expect(examTemplates.page).toHaveURL(/\/exam\?/);
        });
    });

    test("F restores search and filters from the URL", async ({ examTemplates }) => {
        await examTemplates.page.goto(
            `/exam?search=${encodeURIComponent(searchName)}&status=RUNNING`,
        );

        await examTemplates.searchBar.expectInputValue(searchName);
        await examTemplates.table.expectRowVisible(runningId);
        await examTemplates.table.expectRowAbsent(upcomingId);
    });

    test("G shows the empty state when nothing matches", async ({ examTemplates }) => {
        await examTemplates.goto();
        await examTemplates.expectListRequestSucceeded(() =>
            examTemplates.search("zzz-no-such-exam-000"),
        );
        await expect(examTemplates.page.getByText("No Data Available")).toBeVisible();
    });

    test("H add button navigates to the create page", async ({ examTemplates }) => {
        await examTemplates.goto();
        await examTemplates.layout.addButton.click();
        await expect(examTemplates.page).toHaveURL(/\/exam\/create/);
    });
});
