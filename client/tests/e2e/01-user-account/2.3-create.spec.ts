import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { expectNoRequest, waitForRequest } from "../utils/networkAssertions";
import { expectToHaveUrl } from "../utils/helpers";
import { USER_ACCOUNT_FIELD } from "@/pages/(app)/user-account/userAccountFormConfig.ts";
import { USER_ACCOUNT_CREATE_REQUEST } from "./models/user-account-create.model";

const input = {
    institution: "SEB Server",
    username: "e2e-create-account",
    name: "E2E",
    surname: "e2e-create-account",
    email: "e2e-create@example.com",
    password: "Testtest1!",
    role: "Exam Administrator",
};

const createdUser = {
    uuid: "e2e-create-account-uuid",
    institutionId: 11,
    name: input.name,
    surname: input.surname,
    username: input.username,
    email: input.email,
    active: true,
    language: "en",
    timezone: "UTC",
    userRoles: ["EXAM_ADMIN", "EXAM_SUPPORTER"],
};

test.describe("01 User Accounts - CREATE", () => {
    test.use({ timezoneId: "UTC" });

    test("A builds the create request from the form fields and redirects to the list", async ({
        userAccountCreate,
    }) => {
        const page = userAccountCreate.page;

        await page.route(USER_ACCOUNT_CREATE_REQUEST, async (route) => {
            if (route.request().method() !== "POST") {
                return route.continue();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(createdUser),
            });
        });

        const createRequest = waitForRequest(
            page,
            "POST",
            USER_ACCOUNT_CREATE_REQUEST,
        );

        await userAccountCreate.goto();
        await userAccountCreate.fillForm(input);
        await userAccountCreate.submit();

        await test.step("the request carries the values entered in the form", async () => {
            const body = new URLSearchParams(
                (await createRequest).postData() ?? "",
            );
            expect(body.get("institutionId")).toBe("11");
            expect(body.get("username")).toBe(input.username);
            expect(body.get("name")).toBe(input.name);
            expect(body.get("surname")).toBe(input.surname);
            expect(body.get("email")).toBe(input.email);
            expect(body.get("timezone")).toBe("UTC");
            expect(body.get("newPassword")).toBe(input.password);
            expect(body.get("confirmNewPassword")).toBe(input.password);
            expect(body.getAll("userRoles")).toEqual(
                expect.arrayContaining(["EXAM_ADMIN", "EXAM_SUPPORTER"]),
            );
        });

        await test.step("the list opens filtered by the new surname", async () => {
            await expect(page).toHaveURL(
                new RegExp(`/user-account\\?search=${input.surname}`),
            );
        });
    });

    test("B blocks submit and shows field errors when required fields are empty", async ({
        userAccountCreate,
    }) => {
        const page = userAccountCreate.page;
        await userAccountCreate.goto();

        await expectNoRequest({
            page,
            method: "POST",
            urlRegex: USER_ACCOUNT_CREATE_REQUEST,
            action: () => userAccountCreate.submit(),
        });

        await userAccountCreate
            .field(USER_ACCOUNT_FIELD.username)
            .expectError();
        await expect(page).toHaveURL(/\/user-account\/create/);
    });

    test("C cancel returns to the user account list", async ({
        userAccountCreate,
    }) => {
        const page = userAccountCreate.page;
        await userAccountCreate.goto();

        await userAccountCreate.cancel();

        await expectToHaveUrl(page, "user-account");
    });

    test("D surfaces a backend field error on the matching field", async ({
        userAccountCreate,
    }) => {
        const page = userAccountCreate.page;

        await page.route(USER_ACCOUNT_CREATE_REQUEST, async (route) => {
            if (route.request().method() !== "POST") {
                return route.continue();
            }
            await route.fulfill({
                status: 400,
                contentType: "application/json",
                body: JSON.stringify([
                    {
                        messageCode: "1200",
                        systemMessage: "field validation error",
                        attributes: ["user", "username", "username.notunique"],
                    },
                ]),
            });
        });

        await userAccountCreate.goto();
        await userAccountCreate.fillForm(input);
        await userAccountCreate.submit();

        await userAccountCreate
            .field(USER_ACCOUNT_FIELD.username)
            .expectError();
        await expect(page).toHaveURL(/\/user-account\/create/);
    });
});
