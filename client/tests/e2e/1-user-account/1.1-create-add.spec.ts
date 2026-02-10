import { test, expect, Page } from "@playwright/test";
import { loginAsServerAdmin } from "../utils/authenticate";
import {
    generateUniqueUsername,
    navigateTo,
    selectVuetifyOptionByName,
} from "../utils/helpers";

async function setupCreateUserAccountPage(page: Page) {
    await expect(
        page.getByTestId("createUserAccount-form-container"),
    ).toBeVisible();

    //selects
    const institutionSelectLocator = page.getByTestId(
        "createUserAccount-institution-select",
    );

    const timezoneSelectLocator = page.getByTestId(
        "createUserAccount-timezone-select",
    );

    const roleSelectLocator = page.getByTestId("createUserAccount-role-select");

    // fields
    const usernameLocator = page.getByLabel(/username/i);

    const nameLocator = page
        .getByTestId("createUserAccount-name-input")
        .getByRole("textbox");
    const surnameLocator = page
        .getByTestId("createUserAccount-surname-input")
        .getByRole("textbox");
    const emailLocator = page
        .getByTestId("createUserAccount-email-input")
        .getByRole("textbox");

    const passwordLocator = page
        .getByTestId("createUserAccount-password-input")
        .getByRole("textbox");
    const confirmPasswordLocator = page
        .getByTestId("createUserAccount-confirmPassword-input")
        .getByRole("textbox");

    const saveButtonLocator = page.getByTestId("createUserAccount-save-button");
    const cancelButtonLocator = page.getByTestId(
        "createUserAccount-cancel-button",
    );

    return {
        institutionSelectLocator,
        usernameLocator,
        nameLocator,
        surnameLocator,
        emailLocator,
        timezoneSelectLocator,
        passwordLocator,
        confirmPasswordLocator,
        roleSelectLocator,
        saveButtonLocator,
        cancelButtonLocator,
    };
}

async function expectSuccessfulCreateRedirect(page: Page) {
    await expect(page).toHaveURL(/\/user-accounts(?:$|[?#])/i, {
        timeout: 10_000,
    });
}

//TODO this test was left with kinda big redundancies to explain to the apprentices in simple terms what is going on. Small refactor later
test.describe("1.1 User Accounts - CREATE Add", () => {
    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        await navigateTo(page, "/user-accounts/create");
    });

    test("A Success - creates a new INACTIVE user account", async ({
        page,
    }) => {
        const {
            institutionSelectLocator,
            usernameLocator,
            nameLocator,
            surnameLocator,
            emailLocator,
            timezoneSelectLocator,
            passwordLocator,
            confirmPasswordLocator,
            roleSelectLocator,
            saveButtonLocator,
        } = await setupCreateUserAccountPage(page);

        const uniqueValue = generateUniqueUsername("e2e-1.1.A-Success");

        //define values to be filled in
        const username = uniqueValue;
        const name = uniqueValue + "Name";
        const surname = uniqueValue + "LastName";
        const email = uniqueValue + "@email.com";
        const password = "StrongPass123!";

        const institutionToSelect = "SEB Server";
        const roleToSelect = "Server Administrator";
        const timeZoneToSelect = "Europe/Zurich";

        // fill selects
        await selectVuetifyOptionByName(
            page,
            institutionSelectLocator,
            institutionToSelect,
        );
        await selectVuetifyOptionByName(page, roleSelectLocator, roleToSelect);
        await selectVuetifyOptionByName(
            page,
            timezoneSelectLocator,
            timeZoneToSelect,
        );

        //fill fields
        await usernameLocator.fill(username);
        await nameLocator.fill(name);
        await surnameLocator.fill(surname);
        await emailLocator.fill(email);
        await passwordLocator.fill(password);
        await confirmPasswordLocator.fill(password);

        //create api interceptors befrre clicking save
        const createRequestPromise = page.waitForRequest((req) => {
            return (
                req.method() === "POST" &&
                /\/useraccount(?:\?|$)/i.test(req.url())
            );
        });

        const createResponsePromise = page.waitForResponse((resp) => {
            return (
                resp.request().method() === "POST" &&
                /\/useraccount(?:\?|$)/i.test(resp.url())
            );
        });

        // click save
        await saveButtonLocator.click();

        // capture req and resp
        const createRequest = await createRequestPromise;
        const createResponse = await createResponsePromise;

        // assert endpoint aand method, then status
        expect(createRequest.method()).toBe("POST");
        expect(createRequest.url()).toMatch(/\/useraccount(?:\?|$)/i);

        expect(createResponse.status()).toBe(200);
        expect(createResponse.ok()).toBeTruthy();

        // assert payload
        const actualPayload = createRequest.postDataJSON();

        //this needs to match the fields we filled out above
        const expectedPayload = {
            institutionId: "11", //this matches SQL script for e2e testing!!! it corresponds to SEB Server institution
            name: name,
            surname: surname,
            username: username,
            newPassword: password,
            confirmNewPassword: password,
            timezone: timeZoneToSelect,
            language: "en",
            email: email,
            userRoles: ["SEB_SERVER_ADMIN"],
        };

        expect(actualPayload).toEqual(expectedPayload);

        await expectSuccessfulCreateRedirect(page);

        //note that this test does not test if the backend actually saves the data correctly. This could be done in 2 ways:
        // 1: Navigate to User accounts, search for the username entered in the test, and look at the details - This however creates a dependency on get all, and get by id working. If one of those is broken, this test would fail too
        // 2: Clean way, set up a database query to actually verify the data is entered correct in the tables - This would be the clean way
    });

    test("B Client Validation - checks all validations and that create button doesn't do API call", async ({
        page,
    }) => {
        const { passwordLocator, confirmPasswordLocator, saveButtonLocator } =
            await setupCreateUserAccountPage(page);

        // mo post request allowed during this test (well none should get through)
        await page.route(/\/useraccount(?:\?|$)/i, async (route, request) => {
            if (request.method() === "POST") {
                await route.abort();
                throw new Error(
                    "POST /useraccount was attempted during failed client validation test",
                );
            }
            await route.continue();
        });

        page.on("request", (req) => {
            if (
                req.method() === "POST" &&
                /\/useraccount(?:\?|$)/i.test(req.url())
            ) {
                throw new Error(
                    `Validation test must not call POST /useraccount, but it did: ${req.url()}`,
                );
            }
        });

        async function expectFieldError(testId: string, text: string) {
            const field = page.getByTestId(testId);
            await expect(
                field.locator(".v-messages__message").filter({ hasText: text }),
            ).toHaveCount(1, { timeout: 5000 });
        }

        const REQUIRED = "This field is required";
        const PASSWORD_TOO_SHORT = "Password must be at least 8 characters";
        const PASSWORDS_MUST_MATCH = "Passwords must match";

        // 1. Click with all empty
        await saveButtonLocator.click();

        await expectFieldError(
            "createUserAccount-institution-select",
            REQUIRED,
        );
        await expectFieldError("createUserAccount-username-input", REQUIRED);
        await expectFieldError("createUserAccount-name-input", REQUIRED);
        await expectFieldError("createUserAccount-surname-input", REQUIRED);
        await expectFieldError("createUserAccount-password-input", REQUIRED);
        await expectFieldError(
            "createUserAccount-confirmPassword-input",
            REQUIRED,
        );
        await expectFieldError("createUserAccount-role-select", REQUIRED);

        // 2. Too short password
        await passwordLocator.fill("Abc1"); // < 8
        await saveButtonLocator.click();

        await expectFieldError(
            "createUserAccount-password-input",
            PASSWORD_TOO_SHORT,
        );

        // 3. missmatch passwords
        await passwordLocator.fill("Abcdefg1");
        await confirmPasswordLocator.fill("Abcdefg2");
        await saveButtonLocator.click();

        await expectFieldError(
            "createUserAccount-confirmPassword-input",
            PASSWORDS_MUST_MATCH,
        );

        // expected to not change URL
        await expect(page).toHaveURL(/\/user-accounts\/create(?:$|[?#])/i);
    });

    test("C Server Error - user account already exists (duplicate username)", async ({
        page,
    }) => {
        const {
            institutionSelectLocator,
            usernameLocator,
            nameLocator,
            surnameLocator,
            emailLocator,
            timezoneSelectLocator,
            passwordLocator,
            confirmPasswordLocator,
            roleSelectLocator,
            saveButtonLocator,
        } = await setupCreateUserAccountPage(page);

        const uniqueValue = generateUniqueUsername("e2e-1.1.C-Server-Error");

        const username = "createtests"; // SQL Script includes a user with this username!!!
        const name = uniqueValue + "Name";
        const surname = uniqueValue + "LastName";
        const email = uniqueValue + "@email.com";
        const password = "StrongPass123!";

        const institutionToSelect = "SEB Server";
        const roleToSelect = "Server Administrator";
        const timeZoneToSelect = "Europe/Zurich";

        // fill selects
        await selectVuetifyOptionByName(
            page,
            institutionSelectLocator,
            institutionToSelect,
        );
        await selectVuetifyOptionByName(page, roleSelectLocator, roleToSelect);
        await selectVuetifyOptionByName(
            page,
            timezoneSelectLocator,
            timeZoneToSelect,
        );

        //fill fields
        await usernameLocator.fill(username);
        await nameLocator.fill(name);
        await surnameLocator.fill(surname);
        await emailLocator.fill(email);
        await passwordLocator.fill(password);
        await confirmPasswordLocator.fill(password);

        const createRequestPromise = page.waitForRequest((req) => {
            return (
                req.method() === "POST" &&
                /\/useraccount(?:\?|$)/i.test(req.url())
            );
        });

        const createResponsePromise = page.waitForResponse((resp) => {
            return (
                resp.request().method() === "POST" &&
                /\/useraccount(?:\?|$)/i.test(resp.url())
            );
        });

        await saveButtonLocator.click();

        const createRequest = await createRequestPromise;
        const createResponse = await createResponsePromise;

        expect(createRequest.method()).toBe("POST");
        expect(createRequest.url()).toMatch(/\/useraccount(?:\?|$)/i);

        expect(createResponse.status()).toBe(400);
        expect(createResponse.ok()).toBeFalsy();

        await expect(page).toHaveURL(/\/user-accounts\/create(?:$|[?#])/i);

        //check toast
        const toast = page.locator(".toast-item[role='alert']");

        await expect(toast).toBeVisible();

        await expect(toast.locator(".toast-text")).toContainText(
            "Field validation error",
        );
        await expect(toast.locator(".toast-text")).toContainText(
            "Username is already being used.",
        );
    });
});
