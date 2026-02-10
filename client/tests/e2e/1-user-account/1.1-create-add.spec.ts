import { test, expect, Page } from "@playwright/test";
import { loginAsServerAdmin } from "../utils/authenticate";
import {
    generateUniqueUsername,
    navigateTo,
    selectVuetifyFirstOption,
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

test.describe("1.1 User Accounts - CREATE Add", () => {
    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        await navigateTo(page, "/user-accounts/create");
    });

    //test A
    test("A Success - creates a new INACTIVE user account, verifies user with all details were created successfully", async ({
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

        const uniqueValue = generateUniqueUsername(
            "e2e-1.1.A-Success-User-Accounts",
        );

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
            institutionId: "11", //this matches SQL script for e2e testing!!!
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

    test("B Failed Validation - password too short", async ({ page }) => {
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

        const uname = generateUniqueUsername("e2e-invalid");

        if (await institutionSelectLocator.isEnabled()) {
            await selectVuetifyOptionByName(
                page,
                institutionSelectLocator,
                "SEB Server",
            );
        }

        await usernameLocator.fill(uname);
        await nameLocator.fill("Test");
        await surnameLocator.fill("User");
        await emailLocator.fill(`${uname}@example.com`);

        await selectVuetifyFirstOption(page, timezoneSelectLocator);

        // too short (<8)
        await passwordLocator.fill("Abc1");
        await confirmPasswordLocator.fill("Abc1");

        await selectVuetifyFirstOption(page, roleSelectLocator);

        await saveButtonLocator.click();

        await expect(page).toHaveURL(/\/user-accounts\/create(?:$|[?#])/i);

        const anyValidationMessage = page.locator(
            ".v-messages .v-messages__message",
        );
        await expect(anyValidationMessage.first()).toBeVisible();
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

        // Seeded by Flyway/SQL (precondition)
        const uname = "createtests";

        if (await institutionSelectLocator.isEnabled()) {
            await selectVuetifyOptionByName(
                page,
                institutionSelectLocator,
                "SEB Server",
            );
        }

        await usernameLocator.fill(uname);
        await nameLocator.fill("John");
        await surnameLocator.fill("Doe");
        await emailLocator.fill(`${uname}@example.com`);

        await selectVuetifyFirstOption(page, timezoneSelectLocator);

        await passwordLocator.fill("StrongPass123!");
        await confirmPasswordLocator.fill("StrongPass123!");

        await selectVuetifyFirstOption(page, roleSelectLocator);

        await saveButtonLocator.click();

        await expect(page).toHaveURL(/\/user-accounts\/create(?:$|[?#])/i);
    });
});
