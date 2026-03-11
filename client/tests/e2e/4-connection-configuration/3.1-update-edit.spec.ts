import { expect, Page, test, TestInfo } from "@playwright/test";
import { loginAsServerAdmin } from "../utils/authenticate";
import { addBrowserSuffixToText } from "../utils/helpers";
import { PlaywrightConnectionConfigurationsPage } from "./models/playwright-connection-configurations-page";

test.describe("4.3.1 Connection Configurations - UPDATE Edit", () => {
    let connectionConfigurationsPage: PlaywrightConnectionConfigurationsPage;

    function getEditConnectionConfigurationIdsForBrowser(
        browserName: string,
        baseCase: "a" | "b" | "c" | "d" | "e" | "f",
    ) {
        const ids = {
            chromium: { a: 1017, b: 1020, c: 1023, d: 1026, e: 1029, f: 1032 },
            firefox: { a: 1018, b: 1021, c: 1024, d: 1027, e: 1030, f: 1033 },
            webkit: { a: 1019, b: 1022, c: 1025, d: 1028, e: 1031, f: 1034 },
        } as const;

        if (!(browserName in ids)) {
            throw new Error(`Unsupported browser: ${browserName}`);
        }

        return ids[browserName as keyof typeof ids][baseCase];
    }

    async function openEditConnectionConfigurationForTest(
        page: Page,
        testInfo: TestInfo,
        browserName: string,
        baseCase: "a" | "b" | "c" | "d" | "e" | "f",
        baseName: string,
    ) {
        const id = getEditConnectionConfigurationIdsForBrowser(
            browserName,
            baseCase,
        );
        const name = addBrowserSuffixToText(baseName, testInfo);

        await connectionConfigurationsPage.search(name);
        const editPage = await connectionConfigurationsPage.clickEditButton(id);

        await editPage.expectVisible();
        await editPage.expectStillOnEditPage(id);
        await editPage.expectFormLoaded({
            name,
        });

        return { editPage, id, name };
    }

    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);

        connectionConfigurationsPage =
            new PlaywrightConnectionConfigurationsPage(page);
        await connectionConfigurationsPage.goto();
        await connectionConfigurationsPage.expectVisible();
    });

    test("A Success", async ({ page, browserName }) => {
        const { editPage, id } = await openEditConnectionConfigurationForTest(
            page,
            test.info(),
            browserName,
            "a",
            "testedit-a-connection-configuration",
        );

        const unique = `e2e-4.3.1.A-${Date.now()}`;

        await editPage.fillEditForm({
            name: `${unique}-config`,
            configurationPurposeName: "Starting an Exam",
            pingInterval: 5,
            withFallback: true,
            fallbackStartUrl: "https://fallback-edited.example.com",
            connectionAttempts: 3,
            fallbackInterval: 2,
            connectionTimeout: 10,
            configurationPassword: "StrongPass123!",
            confirmConfigurationPassword: "StrongPass123!",
            fallbackPassword: "Fallback123!",
            confirmFallbackPassword: "Fallback123!",
            quitPassword: "QuitPass123!",
            confirmQuitPassword: "QuitPass123!",
        });

        await editPage.toggleStatusChip();

        await expect(editPage.saveButton).toBeEnabled();

        await editPage.expectEditRequestSucceeded(async () => {
            await editPage.submitSaveChanges();
        });

        await editPage.expectStillOnEditPage(id);
    });

    test("B Validation Failure", async ({ page, browserName }) => {
        const REQUIRED = "This field is required";

        const { editPage, id } = await openEditConnectionConfigurationForTest(
            page,
            test.info(),
            browserName,
            "b",
            "testedit-b-connection-configuration",
        );

        await editPage.fillName("");
        await editPage.clearPingInterval();

        await editPage.expectNoEditRequest(async () => {
            await editPage.submitSaveChanges();
        });

        await editPage.expectRequiredFieldErrors({
            name: REQUIRED,
            pingInterval: REQUIRED,
        });

        await editPage.expectStillOnEditPage(id);
    });

    //aight
    test("C Server Error - duplicate name", async ({ page, browserName }) => {
        const { editPage, id } = await openEditConnectionConfigurationForTest(
            page,
            test.info(),
            browserName,
            "c",
            "testedit-c-connection-configuration",
        );

        await editPage.fillEditForm({
            name: "create-connection-configuration",
        });

        await editPage.expectEditRequestFailed({
            action: async () => {
                await editPage.submitSaveChanges();
            },
        });

        await editPage.expectErrorToast([
            "Field validation error",
            "Name is already being used.",
        ]);

        await editPage.expectStillOnEditPage(id);
    });

    test("D Success - save without fallback", async ({ page, browserName }) => {
        const { editPage } = await openEditConnectionConfigurationForTest(
            page,
            test.info(),
            browserName,
            "d",
            "testedit-d-connection-configuration",
        );

        const unique = `e2e-4.3.1.D-${Date.now()}`;

        await editPage.fillEditForm({
            name: `${unique}-config`,
            configurationPurposeName: "Configure a Client",
            pingInterval: 10,
            withFallback: false,
            configurationPassword: "StrongPass123!",
            confirmConfigurationPassword: "StrongPass123!",
        });

        await editPage.expectEditRequestSucceeded(async () => {
            await editPage.submitSaveChanges();
        });

        await editPage.expectRedirectToConnectionConfigurations();
    });

    test("E Success - save with asymmetric-only encryption", async ({
        page,
        browserName,
    }) => {
        const { editPage } = await openEditConnectionConfigurationForTest(
            page,
            test.info(),
            browserName,
            "e",
            "testedit-e-connection-configuration",
        );

        const unique = `e2e-4.3.1.E-${Date.now()}`;

        await editPage.fillEditForm({
            name: `${unique}-config`,
            configurationPurposeName: "Starting an Exam",
            pingInterval: 15,
            asymmetricOnlyEncryption: true,
            withFallback: false,
            configurationPassword: "StrongPass123!",
            confirmConfigurationPassword: "StrongPass123!",
        });

        await editPage.expectEditRequestSucceeded(async () => {
            await editPage.submitSaveChanges();
        });

        await editPage.expectRedirectToConnectionConfigurations();
    });

    test("F Client Validation - fallback required fields and password mismatch", async ({
        page,
        browserName,
    }) => {
        const REQUIRED = "This field is required";
        const MUST_MATCH = "Passwords don't match\n";
        const MUST_BE_URL = "Must start with http:// or https://";

        const { editPage, id } = await openEditConnectionConfigurationForTest(
            page,
            test.info(),
            browserName,
            "f",
            "testedit-f-connection-configuration",
        );

        await editPage.toggleWithFallback(true);
        await editPage.clearFallbackNumericFields();

        await editPage.expectNoEditRequest(async () => {
            await editPage.submitSaveChanges();
        });

        await editPage.expectFallbackRequiredFieldErrors({
            fallbackStartUrl: REQUIRED,
            connectionAttempts: REQUIRED,
            fallbackInterval: REQUIRED,
            connectionTimeout: REQUIRED,
        });

        await editPage.fillFallbackStartUrl("abc");
        await editPage.blurFallbackStartUrl();

        await editPage.expectFieldError(
            "connectionConfigurationEdit-fallbackStartUrl-input",
            MUST_BE_URL,
        );

        await editPage.fillConfigurationPassword("Password123!");
        await editPage.fillConfirmConfigurationPassword("Password456!");

        await editPage.expectNoEditRequest(async () => {
            await editPage.submitSaveChanges();
        });

        await editPage.expectFieldError(
            "connectionConfigurationEdit-confirmConfigurationPassword-input",
            MUST_MATCH,
        );

        await editPage.expectStillOnEditPage(id);
    });
});
