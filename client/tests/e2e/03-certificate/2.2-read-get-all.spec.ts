import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { certificateRows } from "./models/certificates-list.model";
import { CERTIFICATE_COLUMN } from "@/pages/(app)/certificate/certificateListConfig.ts";

const searchAlias = "e2e-getall-cert";
const firstAlias = "e2e-getall-cert-01";

test.describe("03 Certificates - READ Get All", () => {
    test("A searches by alias and shows the matching rows", async ({
        certificates,
    }) => {
        await certificates.mockList(certificateRows(6));
        await certificates.goto();
        expect(certificates.page.url()).toContain("/certificate");

        await test.step("search by alias triggers list request", async () => {
            await certificates.expectListRequestSucceeded(
                () => certificates.search(searchAlias),
                {
                    urlMustContain: [
                        /[?&]alias=/i,
                        encodeURIComponent(searchAlias),
                    ],
                },
            );
        });

        await test.step("the seeded certificate row is visible", async () => {
            await certificates.table.expectRowVisible(firstAlias);
        });
    });

    test("C sorts and paginates", async ({ certificates }) => {
        await certificates.mockList(certificateRows(6), { pages: 2 });
        await certificates.goto();
        await certificates.expectListRequestSucceeded(() =>
            certificates.search(searchAlias),
        );
        await certificates.table.expectRowVisible(firstAlias);

        await test.step("sort by Alias ascending triggers sort=alias", async () => {
            await certificates.expectListRequestSucceeded(
                () => certificates.table.sortByColumn(CERTIFICATE_COLUMN.alias),
                { urlMustContain: [/[?&]sort=alias(?:&|$)/i] },
            );
        });

        await test.step("sort by Alias again triggers descending sort=-alias", async () => {
            await certificates.expectListRequestSucceeded(
                () => certificates.table.sortByColumn(CERTIFICATE_COLUMN.alias),
                { urlMustContain: [/[?&]sort=-alias/i] },
            );
        });

        await test.step("items-per-page resizes the page request", async () => {
            await certificates.goto();
            await certificates.expectListRequestSucceeded(
                () => certificates.table.setItemsPerPage(5),
                { urlMustContain: [/[?&]page_size=5/i] },
            );
        });

        await test.step("go to page 2 if available", async () => {
            if (await certificates.table.hasPage(2)) {
                await certificates.expectListRequestSucceeded(
                    () => certificates.table.goToPage(2),
                    { urlMustContain: [/[?&]page_number=2/i] },
                );
            }
        });
    });

    test("D shows error UI when the list request fails with 500", async ({
        certificates,
    }) => {
        await certificates.page.route(
            /\/admin-api\/v1\/certificate(?:\?|$)/i,
            (route) =>
                route.fulfill({
                    status: 500,
                    contentType: "application/json",
                    body: JSON.stringify({
                        message: "Internal Server Error (forced by Playwright)",
                    }),
                }),
        );

        await certificates.page.goto(certificates.config.route);
        await expect(
            certificates.page.getByText(/Something went wrong:/i),
        ).toBeVisible();
    });

    test("E delete button opens the confirm dialog and cancel keeps the row", async ({
        certificates,
    }) => {
        await certificates.mockList(certificateRows(6));
        await certificates.goto();
        await certificates.expectListRequestSucceeded(() =>
            certificates.search(searchAlias),
        );
        await certificates.table.expectRowVisible(firstAlias);

        await certificates.table.deleteButton(firstAlias).click();
        await certificates.deleteDialog.expectVisible();
        await certificates.deleteDialog.cancel();
        await certificates.deleteDialog.expectHidden();
        await certificates.table.expectRowVisible(firstAlias);
    });

    test("F restores the search from the URL", async ({ certificates }) => {
        await certificates.mockList(certificateRows(6));
        await certificates.page.goto(
            `/certificate?search=${encodeURIComponent(firstAlias)}`,
        );

        await certificates.searchBar.expectInputValue(firstAlias);
        await certificates.table.expectRowVisible(firstAlias);
    });

    test("G shows the empty state when nothing matches", async ({
        certificates,
    }) => {
        await certificates.mockList([]);
        await certificates.goto();
        await certificates.expectListRequestSucceeded(() =>
            certificates.search("zzz-no-such-certificate-000"),
        );
        await expect(
            certificates.page.getByText("No Data Available"),
        ).toBeVisible();
    });

    test("H add button opens the upload dialog and cancel closes it", async ({
        certificates,
    }) => {
        await certificates.mockList(certificateRows(6));
        await certificates.goto();
        await certificates.openUploadDialog();
        await certificates.uploadDialog.cancel();
        await certificates.uploadDialog.expectHidden();
    });
});
