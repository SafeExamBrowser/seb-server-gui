import { expect, test } from "@playwright/test";
import { addBrowserSuffixToText } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";
import { PlaywrightConnectionConfigurationsPage } from "./models/playwright-connection-configurations-page";

const connectionConfigurationName = "testinactive-connection-configuration";

function getInactiveConnectionConfigurationIdForBrowser(browserName: string) {
    switch (browserName) {
        case "chromium":
            return 1008;
        case "firefox":
            return 1010;
        case "webkit":
            return 1012;
        default:
            throw new Error(`Unsupported browser: ${browserName}`);
    }
}

test.describe("4.3.2 Connection Configurations - UPDATE Activate", () => {
    let connectionConfigurationsPage: PlaywrightConnectionConfigurationsPage;

    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);
        connectionConfigurationsPage =
            new PlaywrightConnectionConfigurationsPage(page);
        await connectionConfigurationsPage.goto();
        await connectionConfigurationsPage.expectVisible();
    });

    test("A Success", async ({ page, browserName }, testInfo) => {
        expect(page.url()).toContain("/connection-configurations");

        const connectionConfigurationNameWithBrowserSuffix =
            addBrowserSuffixToText(connectionConfigurationName, testInfo);

        const connectionConfigurationId =
            getInactiveConnectionConfigurationIdForBrowser(browserName);

        await connectionConfigurationsPage.search(
            connectionConfigurationNameWithBrowserSuffix,
        );

        await connectionConfigurationsPage.expectRowVisible(
            connectionConfigurationId,
        );
        await connectionConfigurationsPage.expectStatusText(
            connectionConfigurationId,
            "Inactive",
        );

        await connectionConfigurationsPage.clickStatusChip(
            connectionConfigurationId,
        );

        await connectionConfigurationsPage.expectStatusDialogVisible();
        await expect(
            connectionConfigurationsPage.statusDialogConfirmButton,
        ).toHaveText("Activate");

        await connectionConfigurationsPage.expectActivateRequestSucceeded(
            connectionConfigurationId,
            async () => {
                await connectionConfigurationsPage.confirmStatusChange();
            },
        );

        await connectionConfigurationsPage.expectStatusText(
            connectionConfigurationId,
            "Active",
        );
    });
});
