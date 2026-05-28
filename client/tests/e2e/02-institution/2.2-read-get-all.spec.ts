import { test, expect } from "../shared/fixtures/table-list-fixtures";

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

        await test.step("clearAll resets pagination and search input", async () => {
            await institutions.expectListRequestSucceeded(
                () => institutions.clearSearchAndFilters(),
                { urlMustContain: [/[?&]page_size=10/i, /[?&]page_number=1/i] },
            );
            await institutions.searchBar.expectInputEmpty();
        });
    });

    test("C sorts and paginates", async ({ institutions }) => {
        await institutions.goto();

        await test.step("sort by Name triggers sort=name", async () => {
            await institutions.expectListRequestSucceeded(
                () => institutions.table.sortByHeaderText("Name"),
                { urlMustContain: [/[?&]sort=name/i] },
            );
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
});
