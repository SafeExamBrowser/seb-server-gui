import type { Page } from "@playwright/test";

import { USER_ACCOUNT_FIELD } from "@/pages/(app)/user-account/userAccountFormConfig.ts";

import { expect, test } from "../shared/fixtures/table-list-fixtures";
import { expectNoRequest, waitForRequest } from "../utils/networkAssertions";
import {
    INSTITUTION_INFO_REQUEST,
    REGISTER_REQUEST,
} from "./models/user-account-register.model";

const input = {
    username: "e2e-register-account",
    name: "E2E",
    surname: "e2e-register-account",
    email: "e2e-register@example.com",
    password: "Testtest1!",
};

const institution = { modelId: "11", name: "SEB Server" };

const registeredUser = {
    uuid: "e2e-register-account-uuid",
    institutionId: 11,
    name: input.name,
    surname: input.surname,
    username: input.username,
    email: input.email,
    active: false,
    language: "en",
    timezone: "UTC",
    userRoles: ["EXAM_SUPPORTER"],
};

// A single institution auto-selects, so the test never touches that dropdown.
async function mockInstitutions(page: Page) {
    await page.route(INSTITUTION_INFO_REQUEST, (route) =>
        route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([institution]),
        }),
    );
}

test.describe("01 User Accounts - REGISTER", () => {
    test.use({ timezoneId: "UTC" });

    test("A builds the register request from the form fields and shows success", async ({
        userAccountRegister,
    }) => {
        const page = userAccountRegister.page;
        await mockInstitutions(page);
        await page.route(REGISTER_REQUEST, async (route) => {
            if (route.request().method() !== "POST") {
                return route.fallback();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(registeredUser),
            });
        });

        const registerRequest = waitForRequest(page, "POST", REGISTER_REQUEST);

        await userAccountRegister.goto();
        await userAccountRegister.fillForm(input);
        await userAccountRegister.submit();

        await test.step("the request carries the values entered in the form", async () => {
            const body = new URLSearchParams(
                (await registerRequest).postData() ?? "",
            );
            expect(body.get("institutionId")).toBe("11");
            expect(body.get("username")).toBe(input.username);
            expect(body.get("name")).toBe(input.name);
            expect(body.get("surname")).toBe(input.surname);
            expect(body.get("email")).toBe(input.email);
            expect(body.get("timezone")).toBe("UTC");
            expect(body.get("newPassword")).toBe(input.password);
            expect(body.get("confirmNewPassword")).toBe(input.password);
        });

        await expect(page.getByTestId("register-success-alert")).toBeVisible();
    });

    test("B blocks submit and shows field errors when required fields are empty", async ({
        userAccountRegister,
    }) => {
        const page = userAccountRegister.page;
        await mockInstitutions(page);
        await userAccountRegister.goto();

        await expectNoRequest({
            page,
            method: "POST",
            urlRegex: REGISTER_REQUEST,
            action: () => userAccountRegister.submit(),
        });

        await userAccountRegister
            .field(USER_ACCOUNT_FIELD.username)
            .expectError();
    });

    test("C login link returns to the login page", async ({
        userAccountRegister,
    }) => {
        const page = userAccountRegister.page;
        await mockInstitutions(page);
        await userAccountRegister.goto();

        await page.getByTestId("register-login-link").click();

        await expect(page).toHaveURL(/\/login(?:$|[?#])/);
    });
});
