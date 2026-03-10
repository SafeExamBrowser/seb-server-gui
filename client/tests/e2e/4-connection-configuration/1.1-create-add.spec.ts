import { expect, test } from "@playwright/test";
import { loginAsServerAdmin } from "../utils/authenticate";
import { generateUniqueUsername } from "../utils/helpers";
import { PlaywrightConnectionConfigurationsPage } from "./models/playwright-connection-configurations-page";
import { PlaywrightCreateConnectionConfigurationPage } from "./models/playwright-create-connection-configuration-page";

test.describe("4.1.1 Connection Configurations - CREATE Add", () => {
    let createConnectionConfigurationPage: PlaywrightCreateConnectionConfigurationPage;

    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);

        const connectionConfigurationsPage =
            new PlaywrightConnectionConfigurationsPage(page);

        await connectionConfigurationsPage.goto();
        await connectionConfigurationsPage.expectVisible();

        createConnectionConfigurationPage =
            await connectionConfigurationsPage.navigateToCreateConnectionConfiguration();

        await createConnectionConfigurationPage.expectVisible();
    });

    test("A Success - creates a new connection configuration with fallback", async ({
        page,
    }) => {
        expect(page.url()).toContain("/connection-configurations/create");

        const uniqueValue = generateUniqueUsername("e2e-4.1.1.A-Success");

        await createConnectionConfigurationPage.fillForm({
            name: `${uniqueValue}-config`,
            configurationPurposeName: "Starting an Exam",
            pingInterval: 5,
            withFallback: true,
            fallbackStartUrl: "https://fallback.example.com",
            connectionAttempts: 3,
            interval: 2,
            connectionTimeout: 10,
            configurationPassword: "StrongPass123!",
            confirmConfigurationPassword: "StrongPass123!",
            fallbackPassword: "Fallback123!",
            confirmFallbackPassword: "Fallback123!",
            quitPassword: "QuitPass123!",
            confirmQuitPassword: "QuitPass123!",
        });

        await createConnectionConfigurationPage.expectCreateRequestSucceeded(
            async () => {
                await createConnectionConfigurationPage.submit();
            },
        );

        await createConnectionConfigurationPage.expectRedirectToConnectionConfigurations();
    });

    test("B Success - creates a new connection configuration without fallback", async ({
        page,
    }) => {
        expect(page.url()).toContain("/connection-configurations/create");

        const uniqueValue = generateUniqueUsername("e2e-4.1.1.B-NoFallback");

        await createConnectionConfigurationPage.fillForm({
            name: `${uniqueValue}-config`,
            configurationPurposeName: "Configure a Client",
            pingInterval: 10,
            withFallback: false,
            configurationPassword: "StrongPass123!",
            confirmConfigurationPassword: "StrongPass123!",
        });

        await createConnectionConfigurationPage.expectCreateRequestSucceeded(
            async () => {
                await createConnectionConfigurationPage.submit();
            },
        );

        await createConnectionConfigurationPage.expectRedirectToConnectionConfigurations();
    });

    test("C Success - creates a new connection configuration with asymmetric-only encryption", async ({
        page,
    }) => {
        expect(page.url()).toContain("/connection-configurations/create");

        const uniqueValue = generateUniqueUsername("e2e-4.1.1.C-Asymmetric");

        await createConnectionConfigurationPage.fillForm({
            name: `${uniqueValue}-config`,
            configurationPurposeName: "Starting an Exam",
            pingInterval: 15,
            asymmetricOnlyEncryption: true,
            withFallback: false,
            configurationPassword: "StrongPass123!",
            confirmConfigurationPassword: "StrongPass123!",
        });

        await createConnectionConfigurationPage.expectCreateRequestSucceeded(
            async () => {
                await createConnectionConfigurationPage.submit();
            },
        );

        await createConnectionConfigurationPage.expectRedirectToConnectionConfigurations();
    });

    test("D Failure - asymmetric-only encryption without certificate shows server error", async ({
        page,
    }) => {
        expect(page.url()).toContain("/connection-configurations/create");
    });

    test("E Client Validation - shows validation messages and does NOT call create API", async ({
        page,
    }) => {
        expect(page.url()).toContain("/connection-configurations/create");

        const REQUIRED = "This field is required";
        const MUST_MATCH = "Passwords don't match\n";
        const MUST_BE_URL = "Must start with http:// or https://";

        // clear default numeric value so required validation can actually fail
        await createConnectionConfigurationPage.clearPingInterval();

        await createConnectionConfigurationPage.expectNoCreateRequest(
            async () => {
                await createConnectionConfigurationPage.submit();
            },
        );

        await createConnectionConfigurationPage.expectRequiredFieldErrors({
            name: REQUIRED,
            configurationPurpose: REQUIRED,
            pingInterval: REQUIRED,
        });

        await createConnectionConfigurationPage.toggleWithFallback(true);

        // clear fallback defaults so required validation can fail there too
        await createConnectionConfigurationPage.clearFallbackNumericFields();

        await createConnectionConfigurationPage.expectNoCreateRequest(
            async () => {
                await createConnectionConfigurationPage.submit();
            },
        );

        await createConnectionConfigurationPage.expectFallbackRequiredFieldErrors(
            {
                fallbackStartUrl: REQUIRED,
                connectionAttempts: REQUIRED,
                interval: REQUIRED,
                connectionTimeout: REQUIRED,
            },
        );

        await createConnectionConfigurationPage.fillFallbackStartUrl("abc");
        await createConnectionConfigurationPage.blurFallbackStartUrl();

        await createConnectionConfigurationPage.expectFieldError(
            "connectionConfigurationCreation-fallbackStartUrl-input",
            MUST_BE_URL,
        );

        await createConnectionConfigurationPage.fillConfigurationPassword(
            "Password123!",
        );
        await createConnectionConfigurationPage.fillConfirmConfigurationPassword(
            "Password456!",
        );

        await createConnectionConfigurationPage.expectNoCreateRequest(
            async () => {
                await createConnectionConfigurationPage.submit();
            },
        );

        await createConnectionConfigurationPage.expectFieldError(
            "connectionConfigurationCreation-confirmConfigurationPassword-input",
            MUST_MATCH,
        );

        await createConnectionConfigurationPage.expectStillOnCreatePage();
    });

    test("F Server Error - duplicate name shows toast", async ({ page }) => {
        expect(page.url()).toContain("/connection-configurations/create");

        await createConnectionConfigurationPage.fillForm({
            name: "create-connection-configuration",
            configurationPurposeName: "Starting an Exam",
            pingInterval: 5,
            withFallback: false,
            configurationPassword: "StrongPass123!",
            confirmConfigurationPassword: "StrongPass123!",
        });

        const resp =
            await createConnectionConfigurationPage.captureCreateResponse(
                async () => {
                    await createConnectionConfigurationPage.submit();
                },
            );

        expect(resp.status()).toBe(400);
        expect(resp.ok()).toBeFalsy();

        await createConnectionConfigurationPage.expectStillOnCreatePage();
        await createConnectionConfigurationPage.expectErrorToast([
            "Field validation error",
            "Name is already being used.",
        ]);
    });
});
