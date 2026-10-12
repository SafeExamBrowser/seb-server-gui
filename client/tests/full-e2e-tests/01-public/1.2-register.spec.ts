import i18n from "@/i18n";
import { expect } from "../../e2e-tests/fixtures/table-list-fixtures.ts";
import { test } from "../fixtures/table-list-fixtures";


const registerUserValid1 = {
    institutionId: "SEB Server",
    username: "e2e-register-account",
    name: "E2E",
    surname: "e2e-register-account",
    email: "e2e-register@example.com",
    password: "Testtest1!",
    confirmPassword: "Testtest1!",
};

const registerUserinvalid1 = {
    institutionId: "SEB Server",
    username: "e2e-register-account",
    name: "E2E",
    surname: "e2e-register-account",
    email: "e2e-register#example.com",
    password: "Testtest1!",
    confirmPassword: "Testtest1!Wrong",
};

test.describe("01 Public - Register", () => {
    test.use({ timezoneId: "UTC" });

    test("A register valid user", async ({
        register,
    }) => {
        const page = register.page;

        await register.goto();

        //check if register button is visible
        await register.expectVisible();

        await register.fillFormPublic(registerUserValid1);

        await register.submit();

        await expect(page.getByTestId("register-success-alert")).toBeVisible();
    });

    test("B try to register an existing user", async ({ register }) => {
        const page = register.page;

        await register.goto();

        //check if register button is visible
        await register.expectVisible();

        await register.fillFormPublic(registerUserValid1);

        await register.submit();

        //we cant use i18n here? the test won't run and does not appear in the test overview
        await expect(
            page.getByText(
                "This Username is already in use. Please choose another one.",
                // i18n.global.t("errors.backend.validation.username-notunique"),
            ),
        ).toBeVisible();
    });

    test("C enter wrong confirm password & invalid email", async ({ register }) => {
        const page = register.page;

        await register.goto();

        //check if register button is visible
        await register.expectVisible();

        await register.fillFormPublic(registerUserinvalid1);

        await register.submit();

        //check if validation for confirm password appears
        //we cant use i18n here? the test won't run and does not appear in the test overview
        await expect(
            page.getByText(
                "Passwords must match",
                // i18n.global.t("errors.backend.validation.username-notunique"),
            ),
        ).toBeVisible();

        //check if validation for email appears
        //we cant use i18n here? the test won't run and does not appear in the test overview
        await expect(
            page.getByText(
                "Please enter a valid email",
                // i18n.global.t("errors.backend.validation.username-notunique"),
            ),
        ).toBeVisible();
    });

});
