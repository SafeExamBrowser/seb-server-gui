import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { CONNECTION_CONFIG_FIELD } from "@/pages/(app)/connection-configuration/connectionConfigurationFormConfig.ts";
import { CONNECTION_CONFIG_CREATE_REQUEST } from "./models/connection-configuration-create.model";

// Valid form input: every case submits a form the frontend rules accept, so the POST always
// fires and the BACKEND is what "rejects" it. That isolates the frontend's backend-error
// handling (does each backend rule land on the right field with the right message?).
const validMainInput = {
    name: "e2e-field-validation-config",
    configurationPurpose: "Starting an Exam",
};

const validFallbackStartUrl = "https://start.example.com";

const MANDATORY = "This field is mandatory";
const MISMATCH = "The retyped password doesn't match the new password";

// One row per backend validation rule the create form can receive on a field. `attributes` is
// the wire `[domain, wireField, rule, ...ruleParams]` array; the frontend maps `wireField` onto
// the form field (directly, or via CONNECTION_CONFIG_FIELD_ALIASES: sebConfigPurpose->
// configurationPurpose, confirm_encrypt_secret->confirmConfigurationPassword, startURL->
// fallbackStartUrl, sebServerFallbackAttempts->connectionAttempts, sebServerFallbackAttemptInterval
// ->interval, sebServerFallbackTimeout->connectionTimeout, sebServerFallbackPasswordHashConfirm->
// confirmFallbackPassword, hashedQuitPasswordConfirm->confirmQuitPassword) and renders the message
// from errors.backend.validation.*. Fallback fields only exist once the fallback switch is on.
type ValidationCase = {
    title: string;
    field: string;
    attributes: string[];
    message: string;
    requiresFallback?: boolean;
};

const cases: ValidationCase[] = [
    {
        title: "name mandatory",
        field: CONNECTION_CONFIG_FIELD.name,
        attributes: ["clientConfig", "name", "notNull"],
        message: MANDATORY,
    },
    {
        title: "name size",
        field: CONNECTION_CONFIG_FIELD.name,
        attributes: ["clientConfig", "name", "size", "3", "255"],
        message: "The size must be between 3 and 255",
    },
    {
        title: "configuration purpose mandatory",
        field: CONNECTION_CONFIG_FIELD.configurationPurpose,
        attributes: ["clientConfig", "sebConfigPurpose", "notNull"],
        message: MANDATORY,
    },
    {
        title: "confirm configuration password mismatch",
        field: CONNECTION_CONFIG_FIELD.confirmConfigurationPassword,
        attributes: [
            "clientConfig",
            "confirm_encrypt_secret",
            "password.mismatch",
        ],
        message: MISMATCH,
    },
    {
        title: "fallback start url invalid",
        field: CONNECTION_CONFIG_FIELD.fallbackStartUrl,
        attributes: ["clientConfig", "startURL", "invalidURL"],
        message: "The input does not match the URL pattern",
        requiresFallback: true,
    },
    {
        title: "connection attempts mandatory",
        field: CONNECTION_CONFIG_FIELD.connectionAttempts,
        attributes: ["clientConfig", "sebServerFallbackAttempts", "notNull"],
        message: MANDATORY,
        requiresFallback: true,
    },
    {
        title: "interval mandatory",
        field: CONNECTION_CONFIG_FIELD.interval,
        attributes: [
            "clientConfig",
            "sebServerFallbackAttemptInterval",
            "notNull",
        ],
        message: MANDATORY,
        requiresFallback: true,
    },
    {
        title: "connection timeout mandatory",
        field: CONNECTION_CONFIG_FIELD.connectionTimeout,
        attributes: ["clientConfig", "sebServerFallbackTimeout", "notNull"],
        message: MANDATORY,
        requiresFallback: true,
    },
    {
        title: "confirm fallback password mismatch",
        field: CONNECTION_CONFIG_FIELD.confirmFallbackPassword,
        attributes: [
            "clientConfig",
            "sebServerFallbackPasswordHashConfirm",
            "password.mismatch",
        ],
        message: MISMATCH,
        requiresFallback: true,
    },
    {
        title: "confirm quit password mismatch",
        field: CONNECTION_CONFIG_FIELD.confirmQuitPassword,
        attributes: [
            "clientConfig",
            "hashedQuitPasswordConfirm",
            "password.mismatch",
        ],
        message: MISMATCH,
        requiresFallback: true,
    },
];

test.describe("04 Connection Configurations - BACKEND FIELD VALIDATION", () => {
    test.use({ timezoneId: "UTC" });

    for (const validationCase of cases) {
        test(`maps the backend "${validationCase.title}" error onto its field`, async ({
            connectionConfigurationCreate,
        }) => {
            const page = connectionConfigurationCreate.page;

            await page.route(
                CONNECTION_CONFIG_CREATE_REQUEST,
                async (route) => {
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
                },
            );

            await connectionConfigurationCreate.goto();
            await connectionConfigurationCreate.fillForm(validMainInput);
            if (validationCase.requiresFallback) {
                await connectionConfigurationCreate.enableFallback();
                await connectionConfigurationCreate.fillFallback({
                    fallbackStartUrl: validFallbackStartUrl,
                });
            }
            await connectionConfigurationCreate.submit();

            await connectionConfigurationCreate
                .field(validationCase.field)
                .expectError(validationCase.message);
            await expect(page).toHaveURL(/\/connection-configuration\/create/);
        });
    }
});
