import { expect, test } from "@playwright/test";
import { addBrowserSuffixToText } from "../utils/helpers";
import { loginAsServerAdmin } from "../utils/authenticate";
import { PlaywrightConnectionConfigurationsPage } from "./models/playwright-connection-configurations-page";

const connectionConfigurationName = "testdelete-connection-configuration";

function getDeleteConnectionConfigurationIdForBrowser(browserName: string) {
    switch (browserName) {
        case "chromium":
            return 1014;
        case "firefox":
            return 1015;
        case "webkit":
            return 1016;
        default:
            throw new Error(`Unsupported browser: ${browserName}`);
    }
}

test.describe("4.4.1 Connection Configurations - DELETE Remove", () => {
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
            getDeleteConnectionConfigurationIdForBrowser(browserName);

        await connectionConfigurationsPage.search(
            connectionConfigurationNameWithBrowserSuffix,
        );

        await expect(
            connectionConfigurationsPage.deleteButton(
                connectionConfigurationId,
            ),
        ).toBeVisible();

        await connectionConfigurationsPage.clickDeleteButton(
            connectionConfigurationId,
        );

        await connectionConfigurationsPage.expectDeleteDialogVisible();

        await expect(
            connectionConfigurationsPage.deleteConfirmButton,
        ).toHaveText("Delete");

        await connectionConfigurationsPage.expectDeleteRequestSucceeded(
            connectionConfigurationId,
            async () => {
                await connectionConfigurationsPage.confirmDelete();
            },
        );
    });
});
