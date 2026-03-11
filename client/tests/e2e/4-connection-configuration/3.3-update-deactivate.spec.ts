import { expect, test } from "@playwright/test";
import { addBrowserSuffixToText } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";
import { PlaywrightConnectionConfigurationsPage } from "./models/playwright-connection-configurations-page";

const connectionConfigurationName = "testactive-connection-configuration";

function getActiveConnectionConfigurationIdForBrowser(browserName: string) {
    switch (browserName) {
        case "chromium":
            return 1009;
        case "firefox":
            return 1011;
        case "webkit":
            return 1013;
        default:
            throw new Error(`Unsupported browser: ${browserName}`);
    }
}

test.describe("4.3.3 Connection Configurations - UPDATE Deactivate", () => {
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
            getActiveConnectionConfigurationIdForBrowser(browserName);

        await connectionConfigurationsPage.search(
            connectionConfigurationNameWithBrowserSuffix,
        );

        await connectionConfigurationsPage.expectRowVisible(
            connectionConfigurationId,
        );
        await connectionConfigurationsPage.expectStatusText(
            connectionConfigurationId,
            "Active",
        );

        await connectionConfigurationsPage.clickStatusChip(
            connectionConfigurationId,
        );

        await connectionConfigurationsPage.expectStatusDialogVisible();
        await expect(
            connectionConfigurationsPage.statusDialogConfirmButton,
        ).toHaveText("Deactivate");

        await connectionConfigurationsPage.expectDeactivateRequestSucceeded(
            connectionConfigurationId,
            async () => {
                await connectionConfigurationsPage.confirmStatusChange();
            },
        );

        await connectionConfigurationsPage.expectStatusText(
            connectionConfigurationId,
            "Inactive",
        );
    });
});
