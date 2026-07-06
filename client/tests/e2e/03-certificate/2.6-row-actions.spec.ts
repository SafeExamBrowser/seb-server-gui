import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { certificateRows } from "./models/certificates-list.model";

// The delete DELETE hits the bare collection path (no query params), unlike the list GET;
// registered after the list mock, this route wins the LIFO match for the mutations.
const CERTIFICATE_MUTATION_REQUEST = /\/admin-api\/v1\/certificate$/i;

const firstAlias = "e2e-getall-cert-01";

test.describe("03 Certificates - ROW ACTIONS", () => {
    test("A confirming delete fires the DELETE and removes the row", async ({
        certificates,
    }) => {
        const page = certificates.page;
        const state = { rows: certificateRows(2) };

        await certificates.mockListFromState(state);
        await page.route(CERTIFICATE_MUTATION_REQUEST, (route) => {
            if (route.request().method() !== "DELETE") {
                return route.fallback();
            }
            state.rows = state.rows.filter((row) => row.alias !== firstAlias);
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify([
                    { modelId: firstAlias, entityType: "CERTIFICATE" },
                ]),
            });
        });

        await certificates.goto();
        await certificates.table.expectRowVisible(firstAlias);

        const request = await certificates.confirmDelete(firstAlias, {
            request: CERTIFICATE_MUTATION_REQUEST,
        });

        await test.step("the request carries the alias as a form field", async () => {
            expect(request.method()).toBe("DELETE");
            const body = new URLSearchParams(request.postData() ?? "");
            expect(body.get("alias")).toBe(firstAlias);
        });

        await certificates.table.expectRowAbsent(firstAlias);
    });

    test("B a delete the backend skips keeps the row and surfaces an error", async ({
        certificates,
    }) => {
        const page = certificates.page;
        const state = { rows: certificateRows(1) };

        await certificates.mockListFromState(state);
        // A referenced certificate is skipped server-side: the DELETE still answers 200,
        // but without the alias in the deleted keys.
        await page.route(CERTIFICATE_MUTATION_REQUEST, (route) => {
            if (route.request().method() !== "DELETE") {
                return route.fallback();
            }
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify([]),
            });
        });

        await certificates.goto();
        await certificates.table.expectRowVisible(firstAlias);

        await certificates.confirmDelete(firstAlias, {
            request: CERTIFICATE_MUTATION_REQUEST,
        });

        await certificates.table.expectRowVisible(firstAlias);
        await expect(
            page.locator(".v-snackbar__content").first(),
        ).toBeVisible();
    });
});
