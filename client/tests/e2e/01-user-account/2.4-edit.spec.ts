import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { waitForRequest } from "../utils/networkAssertions";
import { addBrowserSuffixToText, expectToHaveUrl } from "../utils/helpers";
import { USER_ACCOUNT_FIELD } from "@/pages/(app)/user-account/userAccountFormConfig.ts";
import {
    EDIT_USER_UUID,
    USER_ACCOUNT_SAVE_REQUEST,
    userAccountByIdRequest,
} from "./models/user-account-edit.model";
import type { Page } from "@playwright/test";

const existingUser = {
    uuid: EDIT_USER_UUID,
    institutionId: 11,
    name: "Editme",
    surname: "e2e-edit-account",
    username: "e2e-edit-account",
    email: "e2e-edit@example.com",
    active: true,
    language: "en",
    timezone: "UTC",
    userRoles: ["EXAM_ADMIN", "EXAM_SUPPORTER"],
};

const editedSurname = "e2e-edit-account-changed";

// Seeded rows (shared with the read spec) for the real list -> edit navigation.
const searchSurname = "000-testgetall";
const activeUserUuid = "seb-user-account-getall-active";

async function mockUserLoad(page: Page) {
    await page.route(userAccountByIdRequest(EDIT_USER_UUID), (route) => {
        if (route.request().method() !== "GET") {
            return route.continue();
        }
        return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(existingUser),
        });
    });
}

test.describe("01 User Accounts - EDIT", () => {
    test.use({ timezoneId: "UTC" });

    test("A hydrates the form from the loaded user", async ({
        userAccountEdit,
    }) => {
        await mockUserLoad(userAccountEdit.page);
        await userAccountEdit.goto();

        await userAccountEdit
            .field(USER_ACCOUNT_FIELD.username)
            .expectValue(existingUser.username);
        await userAccountEdit
            .field(USER_ACCOUNT_FIELD.name)
            .expectValue(existingUser.name);
        await userAccountEdit
            .field(USER_ACCOUNT_FIELD.surname)
            .expectValue(existingUser.surname);
        await userAccountEdit
            .field(USER_ACCOUNT_FIELD.email)
            .expectValue(existingUser.email);
    });

    test("B keeps Save disabled until a field changes", async ({
        userAccountEdit,
    }) => {
        await mockUserLoad(userAccountEdit.page);
        await userAccountEdit.goto();

        await userAccountEdit.saveButton.expectDisabled();
        await userAccountEdit
            .field(USER_ACCOUNT_FIELD.surname)
            .set(editedSurname);
        await userAccountEdit.saveButton.expectEnabled();

        await test.step("reverting the change disables Save again", async () => {
            await userAccountEdit
                .field(USER_ACCOUNT_FIELD.surname)
                .set(existingUser.surname);
            await userAccountEdit.saveButton.expectDisabled();
        });
    });

    test("C sends the edited values and returns to the list", async ({
        userAccountEdit,
    }) => {
        const page = userAccountEdit.page;
        await mockUserLoad(page);
        await page.route(USER_ACCOUNT_SAVE_REQUEST, async (route) => {
            if (route.request().method() !== "PUT") {
                return route.continue();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    ...existingUser,
                    surname: editedSurname,
                }),
            });
        });

        const saveRequest = waitForRequest(
            page,
            "PUT",
            USER_ACCOUNT_SAVE_REQUEST,
        );

        await userAccountEdit.goto();
        await userAccountEdit
            .field(USER_ACCOUNT_FIELD.surname)
            .set(editedSurname);
        await userAccountEdit.submit();

        await test.step("the request carries the edited values", async () => {
            // The edit endpoint (PUT) sends JSON, unlike the form-encoded create/register POSTs.
            const body = JSON.parse((await saveRequest).postData() ?? "{}");
            expect(body.surname).toBe(editedSurname);
            expect(body.username).toBe(existingUser.username);
            expect(body.name).toBe(existingUser.name);
            expect(body.institutionId).toBe(existingUser.institutionId);
        });

        await expectToHaveUrl(page, "user-account");
    });

    test("D cancel returns to the user account list", async ({
        userAccountEdit,
    }) => {
        await mockUserLoad(userAccountEdit.page);
        await userAccountEdit.goto();

        await userAccountEdit.cancel();

        await expectToHaveUrl(userAccountEdit.page, "user-account");
    });

    test("E the row edit button opens the edit page for that user", async ({
        userAccounts,
    }, testInfo) => {
        const surname = addBrowserSuffixToText(searchSurname, testInfo);
        const activeId = addBrowserSuffixToText(activeUserUuid, testInfo);

        await userAccounts.goto();
        await userAccounts.expectListRequestSucceeded(() =>
            userAccounts.search(surname),
        );
        await userAccounts.table.expectRowVisible(activeId);

        await userAccounts.table.editButton(activeId).click();

        await expect(userAccounts.page).toHaveURL(
            new RegExp(`/user-account/${activeId}`),
        );
    });
});
