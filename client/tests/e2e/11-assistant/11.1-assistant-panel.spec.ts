import { expect, Page, Route, test } from "@playwright/test";

import { installMockBackend } from "../shared/mocks/mock-backend";
import { loginAsServerAdmin } from "../utils/authenticate";

// Canned gateway answers: the assistant routes live on the gateway (not the
// SEB Server backend), so they are mocked here on top of installMockBackend.
const QUIT_PASSWORD_ANSWER = {
    answer: "The quit password must be entered by a SEB user to quit SEB.",
    sources: ["sebserver.exam.form.quitpwd.tooltip"],
    calls: [],
};

const CREATE_EXAM_ANSWER = {
    answer: "Open Exams and start the preparation wizard.",
    sources: [],
    guide: "create-exam",
    calls: [],
};

const DEFAULT_ANSWER = {
    answer: "I do not know.",
    sources: [],
    calls: [],
};

function json(route: Route, body: unknown, status = 200) {
    return route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(body),
    });
}

async function installAssistantMock(page: Page) {
    await page.route(/\/api\/assistant\/config(?:$|\?)/, (route) =>
        json(route, { enabled: true }),
    );
    await page.route(/\/api\/assistant\/chat(?:$|\?)/, (route) => {
        const question: string = (
            route.request().postDataJSON() as {
                messages: { content: string }[];
            }
        ).messages.at(-1)?.content as string;
        if (question.toLowerCase().includes("quit password")) {
            return json(route, QUIT_PASSWORD_ANSWER);
        }
        if (question.toLowerCase().includes("create an exam")) {
            return json(route, CREATE_EXAM_ANSWER);
        }
        return json(route, DEFAULT_ANSWER);
    });
    await page.route(/\/api\/assistant\/feedback(?:$|\?)/, (route) =>
        route.fulfill({ status: 204 }),
    );
}

async function openAssistant(page: Page, browser: string) {
    await installMockBackend(page, browser);
    await installAssistantMock(page);
    await loginAsServerAdmin(page);
    await page.getByTestId("assistant-open-button").click();
    await expect(page.getByTestId("assistant-panel")).toBeVisible();
}

test.describe("11 Assistant - PANEL", () => {
    test("A opens from the header and closes again", async ({
        page,
    }, testInfo) => {
        await openAssistant(page, testInfo.project.name);

        await expect(page.getByTestId("assistant-welcome")).toBeVisible();
        await expect(page.getByTestId("assistant-suggestion")).toHaveCount(3);

        await page.getByTestId("assistant-close-button").click();
        await expect(page.getByTestId("assistant-panel")).toBeHidden();
    });

    test("B a question renders an answer with a source chip", async ({
        page,
    }, testInfo) => {
        await openAssistant(page, testInfo.project.name);

        await page.getByTestId("assistant-suggestion").first().click();

        await expect(page.getByTestId("assistant-answer")).toContainText(
            QUIT_PASSWORD_ANSWER.answer,
        );
        await expect(page.getByTestId("assistant-source-chip")).toHaveText(
            QUIT_PASSWORD_ANSWER.sources[0],
        );
    });

    test("C thumbs-down posts to the feedback route", async ({
        page,
    }, testInfo) => {
        await openAssistant(page, testInfo.project.name);

        await page.getByTestId("assistant-suggestion").first().click();
        await expect(page.getByTestId("assistant-answer")).toBeVisible();

        const feedbackRequest = page.waitForRequest(
            (request) =>
                request.url().includes("/api/assistant/feedback") &&
                request.method() === "POST",
        );
        await page.getByTestId("assistant-thumbs-down").click();

        const request = await feedbackRequest;
        expect(request.postDataJSON()).toMatchObject({
            rating: "down",
            answer: QUIT_PASSWORD_ANSWER.answer,
        });
        await expect(
            page.getByTestId("assistant-feedback-thanks"),
        ).toBeVisible();
    });

    test("D the guide marker shows Show me and the first highlight", async ({
        page,
    }, testInfo) => {
        await openAssistant(page, testInfo.project.name);

        await page.getByTestId("assistant-suggestion").nth(2).click();

        const showMe = page.getByTestId("assistant-show-me-button");
        await expect(showMe).toBeVisible();
        await showMe.click();

        await expect(page.locator(".driver-popover")).toBeVisible();
        await expect(page.locator(".driver-popover-title")).toContainText(
            "1 ·",
        );
        await expect(page.locator(".driver-active-element")).toHaveAttribute(
            "data-testid",
            "layout-exam-button",
        );
    });
});
