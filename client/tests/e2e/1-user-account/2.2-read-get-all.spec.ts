import { expect, test } from "@playwright/test";
import { addBrowserSuffixToText } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";
import { PlaywrightUserAccountsPage } from "../models/playwright-user-accounts-page";

const searchSurname = "000-testgetall";
const activeUserUuid = "seb-user-account-getall-active";
const inactiveUserUuid = "seb-user-account-getall-inactive";

const institutionModelId = 11;

test.describe("1.2.2 User Accounts - READ Get All", () => {
    let userAccountsPage: PlaywrightUserAccountsPage;

    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        userAccountsPage = new PlaywrightUserAccountsPage(page);
        await userAccountsPage.goto();
        await userAccountsPage.expectVisible();
    });

    test("A Success", async ({ page }, testInfo) => {
        expect(page.url()).toContain("/user-accounts");

        const surnameWithBrowserSuffix = addBrowserSuffixToText(
            searchSurname,
            testInfo,
        );

        const activeUuidWithBrowserSuffix = addBrowserSuffixToText(
            activeUserUuid,
            testInfo,
        );

        const inactiveUuidWithBrowserSuffix = addBrowserSuffixToText(
            inactiveUserUuid,
            testInfo,
        );

        await userAccountsPage.expectUserAccountsListRequestSucceeded(
            async () => {
                await userAccountsPage.search(surnameWithBrowserSuffix);
            },
            {
                urlMustContain: [
                    /optionalParameters%5Bsurname%5D=/i,
                    encodeURIComponent(surnameWithBrowserSuffix),
                ],
            },
        );

        await userAccountsPage.expectRowVisible(activeUuidWithBrowserSuffix);
        await userAccountsPage.expectRowVisible(inactiveUuidWithBrowserSuffix);
    });

    test("B Using search and filters", async ({ page }, testInfo) => {
        expect(page.url()).toContain("/user-accounts");

        const surnameWithBrowserSuffix = addBrowserSuffixToText(
            searchSurname,
            testInfo,
        );

        const activeUuidWithBrowserSuffix = addBrowserSuffixToText(
            activeUserUuid,
            testInfo,
        );

        const inactiveUuidWithBrowserSuffix = addBrowserSuffixToText(
            inactiveUserUuid,
            testInfo,
        );

        await userAccountsPage.search(surnameWithBrowserSuffix);
        await userAccountsPage.expectRowVisible(activeUuidWithBrowserSuffix);
        await userAccountsPage.expectRowVisible(inactiveUuidWithBrowserSuffix);

        //set status filter inactive
        await userAccountsPage.expectUserAccountsListRequestSucceeded(
            async () => {
                await userAccountsPage.toggleStatusFilter("Inactive");
            },
            { urlMustContain: [/optionalParameters%5Bactive%5D=false/i] },
        );

        await userAccountsPage.expectRowVisible(inactiveUuidWithBrowserSuffix);
        await expect(
            userAccountsPage.row(activeUuidWithBrowserSuffix),
        ).toHaveCount(0);

        //set status filter active
        await userAccountsPage.expectUserAccountsListRequestSucceeded(
            async () => {
                await userAccountsPage.toggleStatusFilter("Active");
            },
            { urlMustContain: [/optionalParameters%5Bactive%5D=true/i] },
        );

        await userAccountsPage.expectRowVisible(activeUuidWithBrowserSuffix);
        await expect(
            userAccountsPage.row(inactiveUuidWithBrowserSuffix),
        ).toHaveCount(0);

        // if possible set institutions
        if (await userAccountsPage.institutionFilterSection.count()) {
            await userAccountsPage.expectInstitutionFilterVisible();

            await userAccountsPage.expectUserAccountsListRequestSucceeded(
                async () => {
                    await userAccountsPage.toggleInstitutionFilter(
                        institutionModelId,
                    );
                },
                {
                    urlMustContain: [
                        new RegExp(
                            `optionalParameters%5BinstitutionId%5D=${institutionModelId}`,
                            "i",
                        ),
                    ],
                },
            );

            // Best-effort: table still renders after filtering
            await expect(userAccountsPage.table).toBeVisible();
        } else {
            await userAccountsPage.expectInstitutionFilterNotVisible();
        }

        //clear filters / searches
        await userAccountsPage.expectUserAccountsListRequestSucceeded(
            async () => {
                await userAccountsPage.clearSearch();
            },
            {
                urlMustContain: [
                    /optionalParameters%5Bpage_size%5D=5/i,
                    /optionalParameters%5Bpage_number%5D=1/i,
                ],
            },
        );

        await expect(userAccountsPage.searchInput).toHaveValue("");
    });

    test("C Using table sorting and paging", async ({ page }, testInfo) => {
        expect(page.url()).toContain("/user-accounts");

        const surnameWithBrowserSuffix = addBrowserSuffixToText(
            searchSurname,
            testInfo,
        );

        await userAccountsPage.search(surnameWithBrowserSuffix);

        // sort by username
        await userAccountsPage.expectUserAccountsListRequestSucceeded(
            async () => {
                await userAccountsPage.sortByHeaderText("Username");
            },
            { urlMustContain: [/optionalParameters%5Bsort%5D=username/i] },
        );

        // sort by name
        await userAccountsPage.expectUserAccountsListRequestSucceeded(
            async () => {
                await userAccountsPage.sortByHeaderText("Name");
            },
            { urlMustContain: [/optionalParameters%5Bsort%5D=name/i] },
        );

        //verify pagination
        const pagination = userAccountsPage.paginationRoot();
        if (await pagination.count()) {
            await userAccountsPage.expectPaginationVisible();

            // Vuetify commonly renders page buttons like "2", "3", ...
            const page2 = pagination.getByRole("button", { name: "2" });
            if (await page2.count()) {
                await userAccountsPage.expectUserAccountsListRequestSucceeded(
                    async () => {
                        await page2.first().click();
                    },
                    {
                        urlMustContain: [
                            /optionalParameters%5Bpage_number%5D=2/i,
                        ],
                    },
                );
            }
        }
    });

    test("D Server Error", async ({ page }) => {
        // Force error 500 via intercept
        await page.route(/\/useraccount\?/i, async (route) => {
            await route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({
                    message: "Internal Server Error (forced by Playwright)",
                }),
            });
        });

        await userAccountsPage.goto();
        await userAccountsPage.expectVisible();
        await userAccountsPage.expectAnyValidationMessageVisible();
    });
});
