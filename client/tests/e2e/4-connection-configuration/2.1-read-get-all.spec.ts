import { expect, test } from "@playwright/test";
import { addBrowserSuffixToText } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";
import { PlaywrightConnectionConfigurationsPage } from "./models/playwright-connection-configurations-page";

const searchName = "000-testgetall-connection-configuration";
const institutionModelId = 11;

function getConnectionConfigurationIdsForBrowser(browserName: string) {
    switch (browserName) {
        case "chromium":
            return { activeId: 1001, inactiveId: 1002 };
        case "firefox":
            return { activeId: 1003, inactiveId: 1004 };
        case "webkit":
            return { activeId: 1005, inactiveId: 1006 };
        default:
            throw new Error(`Unsupported browser: ${browserName}`);
    }
}

test.describe("4.2.1 Connection Configurations - READ Get All", () => {
    let connectionConfigurationsPage: PlaywrightConnectionConfigurationsPage;

    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        connectionConfigurationsPage =
            new PlaywrightConnectionConfigurationsPage(page);
        await connectionConfigurationsPage.goto();
        await connectionConfigurationsPage.expectVisible();
    });

    test("A Success", async ({ page, browserName }, testInfo) => {
        expect(page.url()).toContain("/connection-configurations");

        const nameWithBrowserSuffix = addBrowserSuffixToText(
            searchName,
            testInfo,
        );

        const { activeId, inactiveId } =
            getConnectionConfigurationIdsForBrowser(browserName);

        await connectionConfigurationsPage.expectConnectionConfigurationsListRequestSucceeded(
            async () => {
                await connectionConfigurationsPage.search(
                    nameWithBrowserSuffix,
                );
            },
            {
                urlMustContain: [encodeURIComponent(nameWithBrowserSuffix)],
            },
        );

        await connectionConfigurationsPage.expectRowVisible(activeId);
        await connectionConfigurationsPage.expectRowVisible(inactiveId);
    });

    test("B Using search and filters", async ({
        page,
        browserName,
    }, testInfo) => {
        expect(page.url()).toContain("/connection-configurations");

        const nameWithBrowserSuffix = addBrowserSuffixToText(
            searchName,
            testInfo,
        );

        const { activeId, inactiveId } =
            getConnectionConfigurationIdsForBrowser(browserName);

        await connectionConfigurationsPage.search(nameWithBrowserSuffix);

        await connectionConfigurationsPage.expectRowVisible(activeId);
        await connectionConfigurationsPage.expectRowVisible(inactiveId);

        // set status filter inactive
        await connectionConfigurationsPage.expectConnectionConfigurationsListRequestSucceeded(
            async () => {
                await connectionConfigurationsPage.toggleStatusFilter(
                    "Inactive",
                );
            },
            {
                urlMustContain: [/optionalParameters%5Bactive%5D=false/i],
            },
        );

        await connectionConfigurationsPage.expectRowVisible(inactiveId);
        await expect(connectionConfigurationsPage.row(activeId)).toHaveCount(0);

        // set status filter active
        await connectionConfigurationsPage.expectConnectionConfigurationsListRequestSucceeded(
            async () => {
                await connectionConfigurationsPage.toggleStatusFilter("Active");
            },
            {
                urlMustContain: [/optionalParameters%5Bactive%5D=true/i],
            },
        );

        await connectionConfigurationsPage.expectRowVisible(activeId);
        await expect(connectionConfigurationsPage.row(inactiveId)).toHaveCount(
            0,
        );

        // institution filter if present
        if (
            await connectionConfigurationsPage.institutionFilterContainer.count()
        ) {
            await connectionConfigurationsPage.expectConnectionConfigurationsListRequestSucceeded(
                async () => {
                    await connectionConfigurationsPage.toggleInstitutionFilter(
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

            await expect(connectionConfigurationsPage.table).toBeVisible();
        }

        // clear filters / searches
        await connectionConfigurationsPage.expectConnectionConfigurationsListRequestSucceeded(
            async () => {
                await connectionConfigurationsPage.clearSearch();
            },
            {
                urlMustContain: [
                    /optionalParameters%5Bpage_size%5D=5/i,
                    /optionalParameters%5Bpage_number%5D=1/i,
                ],
            },
        );

        await expect(connectionConfigurationsPage.searchInput).toHaveValue("");
    });

    test("C Using table sorting and paging", async ({ page }, testInfo) => {
        expect(page.url()).toContain("/connection-configurations");

        const nameWithBrowserSuffix = addBrowserSuffixToText(
            searchName,
            testInfo,
        );

        await connectionConfigurationsPage.search(nameWithBrowserSuffix);

        // sort by name
        await connectionConfigurationsPage.expectConnectionConfigurationsListRequestSucceeded(
            async () => {
                await connectionConfigurationsPage.sortByHeaderText("Name");
            },
            {
                urlMustContain: [/optionalParameters%5Bsort%5D=name/i],
            },
        );

        // sort by creation date
        await connectionConfigurationsPage.expectConnectionConfigurationsListRequestSucceeded(
            async () => {
                await connectionConfigurationsPage.sortByHeaderText(
                    "Creation Date",
                );
            },
            {
                urlMustContain: [/optionalParameters%5Bsort%5D=date/i],
            },
        );

        // verify pagination
        const pagination = connectionConfigurationsPage.paginationRoot();
        if (await pagination.count()) {
            const page2 = pagination.getByRole("button", { name: "2" });

            if (await page2.count()) {
                await connectionConfigurationsPage.expectConnectionConfigurationsListRequestSucceeded(
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
        await page.route(/\/client_configuration(?:\?|$)/i, async (route) => {
            await route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({
                    message: "Internal Server Error (forced by Playwright)",
                }),
            });
        });

        await connectionConfigurationsPage.goto();
        await connectionConfigurationsPage.expectVisible();
        await connectionConfigurationsPage.expectErrorToast([
            "Unexpected error —",
            "500",
        ]);
    });
});
