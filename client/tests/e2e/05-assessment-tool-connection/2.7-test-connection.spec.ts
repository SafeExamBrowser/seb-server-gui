import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { waitForRequest } from "../utils/networkAssertions";
import type { Page } from "@playwright/test";

// Seeded active row shared with the read spec.
const searchName = "e2e-getall-assessment-tool";
const activeId = 9101;

// GET /lms-setup/test/{id}; the path modelId is numeric.
const testRequest = new RegExp(`/lms-setup/test/${activeId}(?:$|\\?)`, "i");

async function mockTestResult(page: Page, body: unknown) {
    await page.route(testRequest, (route) => {
        if (route.request().method() !== "GET") {
            return route.continue();
        }
        return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(body),
        });
    });
}

test.describe("05 Assessment Tools - TEST CONNECTION", () => {
    test("A a successful test fires GET /lms-setup/test and shows a success notification", async ({
        assessmentTools,
    }) => {
        const page = assessmentTools.page;
        await mockTestResult(page, { lmsType: "MOCKUP", errors: [] });

        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search(searchName),
        );
        await assessmentTools.table.expectRowVisible(activeId);

        const request = waitForRequest(page, "GET", testRequest);
        await assessmentTools.table.rowAction(activeId, "test").click();
        expect((await request).url()).toMatch(testRequest);

        await expect(
            page.getByText("connected to Assessment Tool"),
        ).toBeVisible();
    });

    test("B a test that returns typed errors shows a warning with the mapped message", async ({
        assessmentTools,
    }) => {
        const page = assessmentTools.page;
        await mockTestResult(page, {
            lmsType: "MOCKUP",
            errors: [{ errorType: "TOKEN_REQUEST", errorMessage: "401" }],
        });

        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search(searchName),
        );
        await assessmentTools.table.expectRowVisible(activeId);

        await assessmentTools.table.rowAction(activeId, "test").click();

        await expect(
            page.getByText("client credentials or access token"),
        ).toBeVisible();
    });

    test("C a test error without an errorType falls back to the backend message", async ({
        assessmentTools,
    }) => {
        const page = assessmentTools.page;
        // No errorType: the flow must surface errorMessage, not a raw i18n key.
        await mockTestResult(page, {
            lmsType: "MOCKUP",
            errors: [{ errorMessage: "custom backend failure" }],
        });

        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search(searchName),
        );
        await assessmentTools.table.expectRowVisible(activeId);

        await assessmentTools.table.rowAction(activeId, "test").click();

        await expect(page.getByText("custom backend failure")).toBeVisible();
        await expect(
            page.getByText(
                "assessmentToolConnections.test.error.message.undefined",
            ),
        ).toBeHidden();
    });
});
