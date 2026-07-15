import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { waitForRequest } from "../utils/networkAssertions";
import { expectToHaveUrl } from "../utils/helpers";
import { INSTITUTION_FIELD } from "./models/institution-create.model";
import {
    EDIT_INSTITUTION_ID,
    INSTITUTION_SAVE_REQUEST,
    institutionByIdRequest,
} from "./models/institution-edit.model";
import { INSTITUTION_LIST_REQUEST } from "./models/institutions-list.model";
import type { Page } from "@playwright/test";

const existingInstitution = {
    id: EDIT_INSTITUTION_ID,
    name: "e2e-edit-institution",
    urlSuffix: "e2e-edit-institution",
    active: true,
};

const editedName = "e2e-edit-institution-changed";

// Seeded rows (shared with the read spec) for the real list -> edit navigation.
const searchName = "Test";
const activeInstitutionId = 11;

const listInstitution = {
    id: activeInstitutionId,
    name: "Test Institution",
    urlSuffix: "test-institution",
    active: true,
};

async function mockInstitutionLoad(page: Page) {
    await page.route(institutionByIdRequest(EDIT_INSTITUTION_ID), (route) => {
        if (route.request().method() !== "GET") {
            return route.continue();
        }
        return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(existingInstitution),
        });
    });
}

async function mockInstitutionList(page: Page) {
    await page.route(INSTITUTION_LIST_REQUEST, (route) => {
        if (route.request().method() !== "GET") {
            return route.continue();
        }

        return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                number_of_pages: 1,
                page_number: 1,
                page_size: 10,
                content: [listInstitution],
            }),
        });
    });
}

test.describe("02 Institutions - EDIT", () => {
    test("A hydrates the form from the loaded institution", async ({
        institutionEdit,
    }) => {
        await mockInstitutionLoad(institutionEdit.page);
        await institutionEdit.goto();

        await institutionEdit
            .field(INSTITUTION_FIELD.name)
            .expectValue(existingInstitution.name);
        await institutionEdit
            .field(INSTITUTION_FIELD.urlSuffix)
            .expectValue(existingInstitution.urlSuffix);
    });

    test("B keeps Save disabled until a field changes", async ({
        institutionEdit,
    }) => {
        await mockInstitutionLoad(institutionEdit.page);
        await institutionEdit.goto();

        await institutionEdit.saveButton.expectDisabled();
        await institutionEdit.field(INSTITUTION_FIELD.name).set(editedName);
        await institutionEdit.saveButton.expectEnabled();

        await test.step("reverting the change disables Save again", async () => {
            await institutionEdit
                .field(INSTITUTION_FIELD.name)
                .set(existingInstitution.name);
            await institutionEdit.saveButton.expectDisabled();
        });
    });

    test("C sends the edited values and returns to the list", async ({
        institutionEdit,
    }) => {
        const page = institutionEdit.page;
        await mockInstitutionLoad(page);
        await page.route(INSTITUTION_SAVE_REQUEST, async (route) => {
            if (route.request().method() !== "PUT") {
                return route.continue();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    ...existingInstitution,
                    name: editedName,
                }),
            });
        });

        const saveRequest = waitForRequest(
            page,
            "PUT",
            INSTITUTION_SAVE_REQUEST,
        );

        await institutionEdit.goto();
        await institutionEdit.field(INSTITUTION_FIELD.name).set(editedName);
        await institutionEdit.submit();

        await test.step("the request carries the edited values as JSON", async () => {
            // The edit endpoint (PUT) sends JSON, unlike the form-encoded create POST.
            const body = JSON.parse((await saveRequest).postData() ?? "{}");
            expect(body.id).toBe(existingInstitution.id);
            expect(body.name).toBe(editedName);
            expect(body.urlSuffix).toBe(existingInstitution.urlSuffix);
            expect(body.active).toBe(existingInstitution.active);
        });

        await expectToHaveUrl(page, "institution");
    });

    test("D cancel returns to the institution list", async ({
        institutionEdit,
    }) => {
        await mockInstitutionLoad(institutionEdit.page);
        await institutionEdit.goto();

        await institutionEdit.cancel();

        await expectToHaveUrl(institutionEdit.page, "institution");
    });

    test("E the row edit button opens the edit page for that institution", async ({
        institutions,
    }) => {
        await mockInstitutionList(institutions.page);

        await institutions.goto();
        await institutions.expectListRequestSucceeded(() =>
            institutions.search(searchName),
        );
        await institutions.table.expectRowVisible(activeInstitutionId);

        await institutions.table.editButton(activeInstitutionId).click();

        await expect(institutions.page).toHaveURL(
            new RegExp(`/institution/${activeInstitutionId}`),
        );
    });
});
