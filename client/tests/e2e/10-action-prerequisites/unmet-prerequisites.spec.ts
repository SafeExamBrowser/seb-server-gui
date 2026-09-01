import { expect, Page, test } from "@playwright/test";

import { installMockBackend } from "../shared/mocks/mock-backend";
import { loginAsServerAdmin } from "../utils/authenticate";

// The default mock institution is fully set up, so every gated action is
// enabled everywhere. Emptying the three prerequisite reads (registered after
// installMockBackend, so they win) produces the fresh-installation state that
// SEBSERV-997 gates on.
async function emptyPrerequisites(page: Page) {
    const json = (body: unknown) => ({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
    });

    await page.route(/\/api\/client_configuration\/names(?:$|\?)/, (route) =>
        route.fulfill(json([])),
    );
    await page.route(/\/api\/lms-setup\/active(?:$|\?)/, (route) =>
        route.fulfill(
            json({
                number_of_pages: 1,
                page_number: 1,
                page_size: 10,
                complete: true,
                content: [],
            }),
        ),
    );
    await page.route(
        /\/api\/admin-api\/v1\/exam-template\/names(?:$|\?)/,
        (route) => route.fulfill(json([])),
    );
}

test.describe("10 Action prerequisites - unmet", () => {
    test("gated actions go dead while their prerequisites are missing", async ({
        page,
    }, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await emptyPrerequisites(page);
        await loginAsServerAdmin(page);

        await test.step("navigation overview items are dead text, not links", async () => {
            for (const testId of [
                "navigationOverview-createTemplate-link",
                "navigationOverview-prepareExam-link",
                "navigationOverview-addExamWithURL-text",
            ]) {
                const item = page.getByTestId(testId);
                await expect(item).toBeVisible();
                await expect(item).toHaveJSProperty("tagName", "SPAN");
                await expect(
                    page.getByTestId(`${testId}-prerequisiteInfo`),
                ).toBeVisible();
            }
        });

        await test.step("the info button explains every missing prerequisite", async () => {
            await page
                .getByTestId(
                    "navigationOverview-prepareExam-link-prerequisiteInfo",
                )
                .focus();
            const messages = page.getByTestId(
                "navigationOverview-prepareExam-link-prerequisiteMessage-text",
            );
            await expect(messages).toHaveCount(2);
            await expect(messages.first()).toContainText("Exam Template");
            await expect(messages.last()).toContainText(
                "Assessment Tool Connection",
            );
        });

        await test.step("the Exams list Prepare button is disabled", async () => {
            await page.goto("/exam");
            await expect(page.getByTestId("exams-add-button")).toBeDisabled();
        });

        await test.step("the Exam Template list Add button is disabled", async () => {
            await page.goto("/exam-template");
            await expect(
                page.getByTestId("examTemplates-add-button"),
            ).toBeDisabled();
        });
    });
});
