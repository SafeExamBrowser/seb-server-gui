import { expect, test } from "../fixtures/table-list-fixtures";
import { expectNoRequest } from "../../utils/networkAssertions";
import {
    EXAM_TEMPLATE_LIST_COLUMN,
    ExamTemplateListModel,
} from "../../shared/page-models/models/exam-template/exam-template-list.model.ts";

const searchName = "NadimTest1";

const templateIdBYOD = "7";
const EXAM_TYPE_BYOD = "BYOD";

const templateIdVDI = "8";
const EXAM_TYPE_VDI = "VDI";

const templateIdMANAGED = "6";
const EXAM_TYPE_MANAGED_DEVICES = "MANAGED";

const templateIdUNDEFINED = "9";
const EXAM_TYPE_NOT_DEFINED = "UNDEFINED";


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
            await examTemplates.table.expectRowVisible(templateIdBYOD);
        });

        await examTemplates.clearSearchAndFilters();
    });

    test("B filter by exam type", async ({ examTemplates }) => {
        await examTemplates.goto();

        await test.step("exam type = BYOD", async () => {
            await testExamTypeFilter(
                examTemplates,
                EXAM_TYPE_BYOD,
                templateIdBYOD,
            );
        });

        await test.step("exam type = VDI", async () => {
            await testExamTypeFilter(
                examTemplates,
                EXAM_TYPE_VDI,
                templateIdVDI,
            );
        });

        await test.step("exam type = MANAGED", async () => {
            await testExamTypeFilter(
                examTemplates,
                EXAM_TYPE_MANAGED_DEVICES,
                templateIdMANAGED,
            );
        });

        await test.step("exam type = UNDEFINED", async () => {
            await testExamTypeFilter(
                examTemplates,
                EXAM_TYPE_NOT_DEFINED,
                templateIdUNDEFINED,
            );
        });

        await test.step("clearAll resets search and filters", async () => {
            await examTemplates.clearSearchAndFilters();
            await examTemplates.searchBar.expectInputEmpty();
            await expect(examTemplates.searchBar.clearAllButton).toBeHidden();
        });
    });

    test("C sorts and paginates", async ({ examTemplates }) => {
        await examTemplates.goto();

        await test.step("sort by name descending sort=-name", async () => {
            await examTemplates.expectListRequestSucceeded(
                () => examTemplates.table.sortByColumn(EXAM_TEMPLATE_LIST_COLUMN.name),
                { urlMustContain: [/[?&]sort=-name(?:&|$)/i] },
            );
        });

        await test.step("sort by description ascending sort=description", async () => {
            await examTemplates.expectListRequestSucceeded(
                () =>
                    examTemplates.table.sortByColumn(
                        EXAM_TEMPLATE_LIST_COLUMN.description,
                    ),
                { urlMustContain: [/[?&]sort=description/i] },
            );
        });

        await test.step("sort by examType ascending sort=examType", async () => {
            await examTemplates.expectListRequestSucceeded(
                () =>
                    examTemplates.table.sortByColumn(
                        EXAM_TEMPLATE_LIST_COLUMN.examType,
                    ),
                { urlMustContain: [/[?&]sort=examType/i] },
            );
        });

        await test.step("items-per-page resizes the page request (when it is a change)", async () => {
            await examTemplates.goto();
            if ((await examTemplates.table.currentItemsPerPage()) !== 5) {
                await examTemplates.expectListRequestSucceeded(
                    () => examTemplates.table.setItemsPerPage(5),
                    { urlMustContain: [/[?&]page_size=5/i] },
                );
            }
        });

        await test.step("go to page 2 if available", async () => {
            if (await examTemplates.table.hasPage(2)) {
                await examTemplates.expectListRequestSucceeded(
                    () => examTemplates.table.goToPage(2),
                    { urlMustContain: [/[?&]page_number=2/i] },
                );
            }
        });
    });

    test("D shows error UI when the list request fails with 500", async ({
        examTemplates,
    }) => {
        await examTemplates.page.route(/\/api\/admin-api\/v1\/exam-template(?:$|\?)/i, (route) =>
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

    test("E the navigate to the exam-template detail page by clicking on the row", async ({
        examTemplates,
    }) => {
        await examTemplates.goto();

        await test.step("clicking on the row opens the exam-template detail page", async () => {
            await examTemplates.table.row(templateIdBYOD).click();
            await expect(examTemplates.page).toHaveURL(
                new RegExp(`/exam-template/${templateIdBYOD}$`),
            );
        });
    });

    test("F shows the empty state when nothing matches", async ({ examTemplates }) => {
        await examTemplates.goto();
        await examTemplates.expectListRequestSucceeded(() =>
            examTemplates.search("zzz-no-such-exam-000"),
        );
        await expect(examTemplates.page.getByText("No Data Available")).toBeVisible();
    });

    test("G add button navigates to the create page", async ({ examTemplates }) => {
        await examTemplates.goto();
        await examTemplates.layout.addButton.click();
        await expect(examTemplates.page).toHaveURL(/\/exam-template\/create/);
    });

    async function testExamTypeFilter(examTemplates: ExamTemplateListModel, examTypeFilter: string, expectedId: string) {
        const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        await examTemplates.expectListRequestSucceeded(
            () => examTemplates.toggleExamTypeFilter(examTypeFilter),
            {
                urlMustContain: [
                    new RegExp(
                        `[?&]examType=${escapeRegExp(examTypeFilter)}`,
                        "i",
                    ),
                ],
            },
        );

        await examTemplates.table.expectRowVisible(expectedId);
    }

});
