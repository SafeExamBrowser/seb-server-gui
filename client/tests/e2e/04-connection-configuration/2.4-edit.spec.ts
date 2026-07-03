import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { waitForRequest } from "../utils/networkAssertions";
import { expectToHaveUrl } from "../utils/helpers";
import { CONNECTION_CONFIG_FIELD } from "@/pages/(app)/connection-configuration/connectionConfigurationFormConfig.ts";
import {
    CONNECTION_CONFIG_SAVE_REQUEST,
    EDIT_CONFIG_ID,
    connectionConfigurationByIdRequest,
} from "./models/connection-configuration-edit.model";
import type { Page } from "@playwright/test";

// Wire values (ms) that the edit page back-converts to seconds on hydration.
const existingConfig = {
    id: EDIT_CONFIG_ID,
    institutionId: 11,
    name: "e2e-edit-connection-config",
    sebConfigPurpose: "START_EXAM",
    sebServerPingTime: 6000,
    vdiSetup: "NO",
    cert_encryption_asym: false,
    sebServerFallback: true,
    startURL: "https://fallback.example.com",
    sebServerFallbackAttempts: 7,
    sebServerFallbackAttemptInterval: 8000,
    sebServerFallbackTimeout: 60000,
    active: true,
};

const editedName = "e2e-edit-connection-config-changed";

// Seeded rows (shared with the read spec) for the real list -> edit navigation.
const searchName = "e2e-getall-connection-config";
const seededActiveId = 9001;

async function mockConfigLoad(page: Page) {
    await page.route(
        connectionConfigurationByIdRequest(EDIT_CONFIG_ID),
        (route) => {
            if (route.request().method() !== "GET") {
                return route.continue();
            }
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(existingConfig),
            });
        },
    );
}

test.describe("04 Connection Configurations - EDIT", () => {
    test.use({ timezoneId: "UTC" });

    test("A hydrates the form from the loaded configuration", async ({
        connectionConfigurationEdit,
    }) => {
        await mockConfigLoad(connectionConfigurationEdit.page);
        await connectionConfigurationEdit.goto();

        await connectionConfigurationEdit
            .field(CONNECTION_CONFIG_FIELD.name)
            .expectValue(existingConfig.name);
        // Wire milliseconds are shown as seconds in the form.
        await connectionConfigurationEdit
            .field(CONNECTION_CONFIG_FIELD.pingInterval)
            .expectValue("6");
        await connectionConfigurationEdit
            .field(CONNECTION_CONFIG_FIELD.fallbackStartUrl)
            .expectValue(existingConfig.startURL);
        await connectionConfigurationEdit
            .field(CONNECTION_CONFIG_FIELD.connectionAttempts)
            .expectValue("7");
        await connectionConfigurationEdit
            .field(CONNECTION_CONFIG_FIELD.interval)
            .expectValue("8");
        await connectionConfigurationEdit
            .field(CONNECTION_CONFIG_FIELD.connectionTimeout)
            .expectValue("60");
    });

    test("B keeps Save disabled until a field changes", async ({
        connectionConfigurationEdit,
    }) => {
        await mockConfigLoad(connectionConfigurationEdit.page);
        await connectionConfigurationEdit.goto();

        await connectionConfigurationEdit.saveButton.expectDisabled();
        await connectionConfigurationEdit
            .field(CONNECTION_CONFIG_FIELD.name)
            .set(editedName);
        await connectionConfigurationEdit.saveButton.expectEnabled();

        await test.step("reverting the change disables Save again", async () => {
            await connectionConfigurationEdit
                .field(CONNECTION_CONFIG_FIELD.name)
                .set(existingConfig.name);
            await connectionConfigurationEdit.saveButton.expectDisabled();
        });
    });

    test("C sends the edited values and returns to the list", async ({
        connectionConfigurationEdit,
    }) => {
        const page = connectionConfigurationEdit.page;
        await mockConfigLoad(page);
        await page.route(CONNECTION_CONFIG_SAVE_REQUEST, async (route) => {
            if (route.request().method() !== "PUT") {
                return route.continue();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ ...existingConfig, name: editedName }),
            });
        });

        const saveRequest = waitForRequest(
            page,
            "PUT",
            CONNECTION_CONFIG_SAVE_REQUEST,
        );

        await connectionConfigurationEdit.goto();
        await connectionConfigurationEdit
            .field(CONNECTION_CONFIG_FIELD.name)
            .set(editedName);
        await connectionConfigurationEdit.submit();

        await test.step("the request carries the edited values as JSON", async () => {
            // The edit endpoint (PUT) sends JSON, unlike the form-encoded create POST.
            const body = JSON.parse((await saveRequest).postData() ?? "{}");
            expect(body.name).toBe(editedName);
            expect(body.id).toBe(existingConfig.id);
            expect(body.institutionId).toBe(existingConfig.institutionId);
        });

        await expectToHaveUrl(page, "connection-configuration");
    });

    test("D cancel returns to the connection configuration list", async ({
        connectionConfigurationEdit,
    }) => {
        await mockConfigLoad(connectionConfigurationEdit.page);
        await connectionConfigurationEdit.goto();

        await connectionConfigurationEdit.cancel();

        await expectToHaveUrl(
            connectionConfigurationEdit.page,
            "connection-configuration",
        );
    });

    test("E the row edit button opens the edit page for that configuration", async ({
        connectionConfigurations,
    }) => {
        await connectionConfigurations.goto();
        await connectionConfigurations.expectListRequestSucceeded(() =>
            connectionConfigurations.search(searchName),
        );
        await connectionConfigurations.table.expectRowVisible(seededActiveId);

        await connectionConfigurations.table.editButton(seededActiveId).click();

        await expect(connectionConfigurations.page).toHaveURL(
            new RegExp(`/connection-configuration/${seededActiveId}`),
        );
    });
});
