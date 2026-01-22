import { test, expect, Page } from "@playwright/test";
import { loginAsServerAdmin } from "../utils/authenticate";
import {
    generateUniqueUsername,
    selectVuetifyFirstOption,
    selectVuetifyOptionByName,
} from "../utils/helpers";

async function setupCreateUserAccountPage(page: Page) {
    await page.goto("/user-accounts/create");
    await expect(
        page.getByTestId("createUserAccount-form-container"),
    ).toBeVisible();

    const institutionSelect = page.getByTestId(
        "createUserAccount-institution-select",
    );
    const username = page
        .getByTestId("createUserAccount-username-input")
        .getByRole("textbox");
    const name = page
        .getByTestId("createUserAccount-name-input")
        .getByRole("textbox");
    const surname = page
        .getByTestId("createUserAccount-surname-input")
        .getByRole("textbox");
    const email = page
        .getByTestId("createUserAccount-email-input")
        .getByRole("textbox");
    const timezoneSelect = page.getByTestId(
        "createUserAccount-timezone-select",
    );
    const password = page
        .getByTestId("createUserAccount-password-input")
        .getByRole("textbox");
    const confirmPassword = page
        .getByTestId("createUserAccount-confirmPassword-input")
        .getByRole("textbox");
    const roleSelect = page.getByTestId("createUserAccount-role-select");

    const saveButton = page.getByTestId("createUserAccount-save-button");
    const cancelButton = page.getByTestId("createUserAccount-cancel-button");

    return {
        institutionSelect,
        username,
        name,
        surname,
        email,
        timezoneSelect,
        password,
        confirmPassword,
        roleSelect,
        saveButton,
        cancelButton,
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
    });

    test("A Success - creates a new INACTIVE user account", async ({
        page,
    }) => {
        const {
            institutionSelect,
            username,
            name,
            surname,
            email,
            timezoneSelect,
            password,
            confirmPassword,
            roleSelect,
            saveButton,
        } = await setupCreateUserAccountPage(page);

        const uname = generateUniqueUsername("e2e-create");

        if (await institutionSelect.isEnabled()) {
            await selectVuetifyOptionByName(
                page,
                institutionSelect,
                "SEB Server",
            );
        }

        await username.fill(uname);
        await name.fill("John");
        await surname.fill("Doe");
        await email.fill(`${uname}@example.com`);

        await selectVuetifyFirstOption(page, timezoneSelect);

        await password.fill("StrongPass123!");
        await confirmPassword.fill("StrongPass123!");

        await selectVuetifyFirstOption(page, roleSelect);

        await saveButton.click();

        await expectSuccessfulCreateRedirect(page);
    });

    test("B Failed Validation - password too short", async ({ page }) => {
        const {
            institutionSelect,
            username,
            name,
            surname,
            email,
            timezoneSelect,
            password,
            confirmPassword,
            roleSelect,
            saveButton,
        } = await setupCreateUserAccountPage(page);

        const uname = generateUniqueUsername("e2e-invalid");

        if (await institutionSelect.isEnabled()) {
            await selectVuetifyOptionByName(
                page,
                institutionSelect,
                "SEB Server",
            );
        }

        await username.fill(uname);
        await name.fill("Test");
        await surname.fill("User");
        await email.fill(`${uname}@example.com`);

        await selectVuetifyFirstOption(page, timezoneSelect);

        // too short (<8)
        await password.fill("Abc1");
        await confirmPassword.fill("Abc1");

        await selectVuetifyFirstOption(page, roleSelect);

        await saveButton.click();

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
            institutionSelect,
            username,
            name,
            surname,
            email,
            timezoneSelect,
            password,
            confirmPassword,
            roleSelect,
            saveButton,
        } = await setupCreateUserAccountPage(page);

        // Seeded by Flyway/SQL (precondition)
        const uname = "createtests";

        if (await institutionSelect.isEnabled()) {
            await selectVuetifyOptionByName(
                page,
                institutionSelect,
                "SEB Server",
            );
        }

        await username.fill(uname);
        await name.fill("John");
        await surname.fill("Doe");
        await email.fill(`${uname}@example.com`);

        await selectVuetifyFirstOption(page, timezoneSelect);

        await password.fill("StrongPass123!");
        await confirmPassword.fill("StrongPass123!");

        await selectVuetifyFirstOption(page, roleSelect);

        await saveButton.click();

        await expect(page).toHaveURL(/\/user-accounts\/create(?:$|[?#])/i);
    });
});
