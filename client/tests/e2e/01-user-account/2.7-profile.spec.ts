import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { waitForRequest } from "../utils/networkAssertions";
import { USER_ACCOUNT_FIELD } from "@/pages/(app)/user-account/userAccountFormConfig.ts";
import {
    CHANGE_PASSWORD_REQUEST,
    PROFILE_SAVE_REQUEST,
} from "./models/user-account-profile.model";
import type { Page } from "@playwright/test";

// The profile page hydrates from the logged-in admin (testmain).
const currentUser = {
    username: "testmain",
    name: "Test",
    surname: "Main",
};

const editedSurname = "Main-edited";

// A full, decodable UserAccount so the mutation's response decode succeeds
// (otherwise the mutation rejects and the success navigation/logout never runs).
const savedUser = {
    uuid: "me",
    institutionId: 11,
    name: currentUser.name,
    surname: editedSurname,
    username: currentUser.username,
    email: "test@example.com",
    active: true,
    language: "en",
    timezone: "UTC",
    userRoles: ["SEB_SERVER_ADMIN"],
};

async function mockProfileSave(page: Page) {
    await page.route(PROFILE_SAVE_REQUEST, async (route) => {
        if (route.request().method() !== "PUT") {
            return route.continue();
        }
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(savedUser),
        });
    });
}

test.describe("01 User Accounts - PROFILE", () => {
    test("A hydrates the form from the current user", async ({
        userAccountProfile,
    }) => {
        await userAccountProfile.goto();

        await userAccountProfile
            .field(USER_ACCOUNT_FIELD.username)
            .expectValue(currentUser.username);
        await userAccountProfile
            .field(USER_ACCOUNT_FIELD.name)
            .expectValue(currentUser.name);
        await userAccountProfile
            .field(USER_ACCOUNT_FIELD.surname)
            .expectValue(currentUser.surname);
    });

    test("B keeps Save disabled until a field changes, then sends the edit", async ({
        userAccountProfile,
    }) => {
        const page = userAccountProfile.page;
        await mockProfileSave(page);

        await userAccountProfile.goto();
        await userAccountProfile.saveButton.expectDisabled();

        await userAccountProfile
            .field(USER_ACCOUNT_FIELD.surname)
            .set(editedSurname);
        await userAccountProfile.saveButton.expectEnabled();

        const saveRequest = waitForRequest(page, "PUT", PROFILE_SAVE_REQUEST);
        await userAccountProfile.submit();

        const body = JSON.parse((await saveRequest).postData() ?? "{}");
        expect(body.surname).toBe(editedSurname);
        expect(body.username).toBe(currentUser.username);

        await expect(page).not.toHaveURL(/\/profile/);
    });

    test("C cancel leaves the profile page", async ({ userAccountProfile }) => {
        await userAccountProfile.goto();
        await userAccountProfile.cancel();
        await expect(userAccountProfile.page).not.toHaveURL(/\/profile/);
    });

    test("D changing the password logs the user out", async ({
        userAccountProfile,
    }) => {
        const page = userAccountProfile.page;
        // Change-password is a PUT to /useraccount/password. Fulfil it for ANY
        // method: this path is only ever the password change, and letting a real
        // request through would actually change the shared testmain password.
        await page.route(CHANGE_PASSWORD_REQUEST, (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(savedUser),
            }),
        );

        await userAccountProfile.goto();
        await userAccountProfile.openPasswordDialog();
        await userAccountProfile.passwordDialog.fill({
            adminPassword: "testmain",
            newPassword: "Testtest1!",
        });

        const passwordRequest = waitForRequest(
            page,
            "PUT",
            CHANGE_PASSWORD_REQUEST,
        );
        await userAccountProfile.passwordDialog.save();
        await passwordRequest;

        await expect(page).toHaveURL(/\/login(?:$|[?#])/);
    });
});
