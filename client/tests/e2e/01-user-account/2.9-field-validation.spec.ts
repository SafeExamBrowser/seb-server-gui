import { USER_ACCOUNT_FIELD } from "@/pages/(app)/user-account/userAccountFormConfig.ts";

import { expect, test } from "../shared/fixtures/table-list-fixtures";
import { USER_ACCOUNT_CREATE_REQUEST } from "./models/user-account-create.model";

// Valid form input: every case submits a form the frontend rules accept, so the POST always
// fires and the BACKEND is what "rejects" it. That isolates the frontend's backend-error
// handling (does each backend rule land on the right field with the right message?).
const validInput = {
    institution: "SEB Server",
    username: "e2e-field-validation",
    name: "E2E",
    surname: "e2e-field-validation",
    email: "e2e-field-validation@example.com",
    password: "Testtest1!",
    role: "Exam Administrator",
};

const MANDATORY = "This field is mandatory";

// One row per backend validation rule the create form can receive on a field. `attributes` is
// the wire `[domain, wireField, rule, ...ruleParams]` array the backend splits a `user:...`
// message into; the frontend maps `wireField` onto the form field (timeZone->timezone,
// userRoles->role, newPassword->password, confirmNewPassword->confirmPassword) and renders the
// message from errors.backend.validation.*. The rules mirror the backend `user:` emitters
// (UserMod / PasswordChange bean validation + uniqueness/format checks).
type ValidationCase = {
    title: string;
    field: string;
    attributes: string[];
    message: string;
};

const cases: ValidationCase[] = [
    {
        title: "institutionId mandatory",
        field: USER_ACCOUNT_FIELD.institutionId,
        attributes: ["user", "institutionId", "notNull"],
        message: MANDATORY,
    },
    {
        title: "username mandatory",
        field: USER_ACCOUNT_FIELD.username,
        attributes: ["user", "username", "notNull"],
        message: MANDATORY,
    },
    {
        title: "username size",
        field: USER_ACCOUNT_FIELD.username,
        attributes: ["user", "username", "size", "3", "255"],
        message: "The size must be between 3 and 255",
    },
    {
        title: "username already in use",
        field: USER_ACCOUNT_FIELD.username,
        attributes: ["user", "username", "username.notunique"],
        message: "This Username is already in use. Please choose another one.",
    },
    {
        title: "name mandatory",
        field: USER_ACCOUNT_FIELD.name,
        attributes: ["user", "name", "notNull"],
        message: MANDATORY,
    },
    {
        title: "name size",
        field: USER_ACCOUNT_FIELD.name,
        attributes: ["user", "name", "size", "0", "255"],
        message: "The size must be between 0 and 255",
    },
    {
        title: "surname mandatory",
        field: USER_ACCOUNT_FIELD.surname,
        attributes: ["user", "surname", "notNull"],
        message: MANDATORY,
    },
    {
        title: "surname size",
        field: USER_ACCOUNT_FIELD.surname,
        attributes: ["user", "surname", "size", "0", "255"],
        message: "The size must be between 0 and 255",
    },
    {
        title: "email invalid",
        field: USER_ACCOUNT_FIELD.email,
        attributes: ["user", "email", "email"],
        message: "Invalid mail address",
    },
    {
        title: "email already in use",
        field: USER_ACCOUNT_FIELD.email,
        attributes: ["user", "email", "email.notunique"],
        message: "A user account with this e-mail address already exists.",
    },
    {
        title: "timezone mandatory",
        field: USER_ACCOUNT_FIELD.timezone,
        attributes: ["user", "timeZone", "notNull"],
        message: MANDATORY,
    },
    {
        title: "role mandatory",
        field: USER_ACCOUNT_FIELD.role,
        attributes: ["user", "userRoles", "notNull"],
        message: MANDATORY,
    },
    {
        title: "password mandatory",
        field: USER_ACCOUNT_FIELD.password,
        attributes: ["user", "newPassword", "notNull"],
        message: MANDATORY,
    },
    {
        title: "password size",
        field: USER_ACCOUNT_FIELD.password,
        attributes: ["user", "newPassword", "size", "8", "255"],
        message: "The size must be between 8 and 255",
    },
    {
        title: "confirm password mandatory",
        field: USER_ACCOUNT_FIELD.confirmPassword,
        attributes: ["user", "confirmNewPassword", "notNull"],
        message: MANDATORY,
    },
    {
        title: "confirm password mismatch",
        field: USER_ACCOUNT_FIELD.confirmPassword,
        attributes: ["user", "confirmNewPassword", "password.mismatch"],
        message: "The retyped password doesn't match the new password",
    },
];

test.describe("01 User Accounts - BACKEND FIELD VALIDATION", () => {
    test.use({ timezoneId: "UTC" });

    for (const validationCase of cases) {
        test(`maps the backend "${validationCase.title}" error onto its field`, async ({
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
                            attributes: validationCase.attributes,
                        },
                    ]),
                });
            });

            await userAccountCreate.goto();
            await userAccountCreate.fillForm(validInput);
            await userAccountCreate.submit();

            await userAccountCreate
                .field(validationCase.field)
                .expectError(validationCase.message);
            await expect(page).toHaveURL(/\/user-account\/create/);
        });
    }
});
