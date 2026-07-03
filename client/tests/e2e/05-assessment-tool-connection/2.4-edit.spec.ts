import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { waitForRequest } from "../utils/networkAssertions";
import { expectToHaveUrl } from "../utils/helpers";
import { ASSESSMENT_TOOL_FIELD } from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";
import {
    ASSESSMENT_TOOL_SAVE_REQUEST,
    EDIT_TOOL_ID,
    assessmentToolByIdRequest,
} from "./models/assessment-tool-edit.model";
import type { Page } from "@playwright/test";

// A token-auth setup: a non-empty lmsRestApiToken makes the edit page hydrate in "token" mode.
const existingTool = {
    id: EDIT_TOOL_ID,
    institutionId: 11,
    name: "e2e-edit-assessment-tool",
    lmsType: "MOCKUP",
    lmsUrl: "https://lms.example.com",
    lmsRestApiToken: "existing-rest-token",
    active: true,
};

const editedName = "e2e-edit-assessment-tool-changed";

// Seeded rows (shared with the read spec) for the real list -> edit navigation.
const searchName = "e2e-getall-assessment-tool";
const seededActiveId = 9101;

async function mockToolLoad(page: Page) {
    await page.route(assessmentToolByIdRequest(EDIT_TOOL_ID), (route) => {
        if (route.request().method() !== "GET") {
            return route.continue();
        }
        return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(existingTool),
        });
    });
}

test.describe("05 Assessment Tools - EDIT", () => {
    test("A hydrates the form from the loaded assessment tool", async ({
        assessmentToolEdit,
    }) => {
        await mockToolLoad(assessmentToolEdit.page);
        await assessmentToolEdit.goto();

        await assessmentToolEdit
            .field(ASSESSMENT_TOOL_FIELD.name)
            .expectValue(existingTool.name);
        await assessmentToolEdit
            .field(ASSESSMENT_TOOL_FIELD.lmsUrl)
            .expectValue(existingTool.lmsUrl);
        // The rest-api token hydrates into the token-auth field.
        await assessmentToolEdit
            .field(ASSESSMENT_TOOL_FIELD.accessToken)
            .expectValue(existingTool.lmsRestApiToken);
    });

    test("B keeps Save disabled until a field changes", async ({
        assessmentToolEdit,
    }) => {
        await mockToolLoad(assessmentToolEdit.page);
        await assessmentToolEdit.goto();

        await assessmentToolEdit.saveButton.expectDisabled();
        await assessmentToolEdit
            .field(ASSESSMENT_TOOL_FIELD.name)
            .set(editedName);
        await assessmentToolEdit.saveButton.expectEnabled();

        await test.step("reverting the change disables Save again", async () => {
            await assessmentToolEdit
                .field(ASSESSMENT_TOOL_FIELD.name)
                .set(existingTool.name);
            await assessmentToolEdit.saveButton.expectDisabled();
        });
    });

    test("C sends the edited values and returns to the list", async ({
        assessmentToolEdit,
    }) => {
        const page = assessmentToolEdit.page;
        await mockToolLoad(page);
        await page.route(ASSESSMENT_TOOL_SAVE_REQUEST, async (route) => {
            if (route.request().method() !== "PUT") {
                return route.continue();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ ...existingTool, name: editedName }),
            });
        });

        const saveRequest = waitForRequest(
            page,
            "PUT",
            ASSESSMENT_TOOL_SAVE_REQUEST,
        );

        await assessmentToolEdit.goto();
        await assessmentToolEdit
            .field(ASSESSMENT_TOOL_FIELD.name)
            .set(editedName);
        await assessmentToolEdit.submit();

        await test.step("the request carries the edited values as JSON", async () => {
            // The edit endpoint (PUT) sends JSON, unlike the form-encoded create POST.
            const body = JSON.parse((await saveRequest).postData() ?? "{}");
            expect(body.name).toBe(editedName);
            expect(body.id).toBe(existingTool.id);
            expect(body.institutionId).toBe(existingTool.institutionId);
            expect(body.lmsType).toBe(existingTool.lmsType);
            expect(body.lmsRestApiToken).toBe(existingTool.lmsRestApiToken);
        });

        await expectToHaveUrl(page, "assessment-tool");
    });

    test("D cancel returns to the assessment tool list", async ({
        assessmentToolEdit,
    }) => {
        await mockToolLoad(assessmentToolEdit.page);
        await assessmentToolEdit.goto();

        await assessmentToolEdit.cancel();

        await expectToHaveUrl(assessmentToolEdit.page, "assessment-tool");
    });

    test("E the row edit button opens the edit page for that assessment tool", async ({
        assessmentTools,
    }) => {
        await assessmentTools.goto();
        await assessmentTools.expectListRequestSucceeded(() =>
            assessmentTools.search(searchName),
        );
        await assessmentTools.table.expectRowVisible(seededActiveId);

        await assessmentTools.table.editButton(seededActiveId).click();

        await expect(assessmentTools.page).toHaveURL(
            new RegExp(`/assessment-tool/${seededActiveId}`),
        );
    });
});
