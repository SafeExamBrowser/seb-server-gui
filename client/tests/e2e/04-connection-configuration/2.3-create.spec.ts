import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { expectNoRequest, waitForRequest } from "../utils/networkAssertions";
import { expectToHaveUrl } from "../utils/helpers";
import { CONNECTION_CONFIG_FIELD } from "@/pages/(app)/connection-configuration/connectionConfigurationFormConfig.ts";
import { CONNECTION_CONFIG_CREATE_REQUEST } from "./models/connection-configuration-create.model";

const mainInput = {
    name: "e2e-create-connection-config",
    configurationPurpose: "Starting an Exam",
    configurationPassword: "Secretpw1!",
    pingInterval: "3",
};

const fallbackInput = {
    fallbackStartUrl: "https://start.example.com",
    connectionAttempts: "7",
    interval: "4",
    connectionTimeout: "45",
};

// A `decodeWire(connectionConfigurationSchema)`-valid body so the post-create
// `router.push({ query: { search: created.name } })` lands on the filtered list.
const createdConfig = {
    id: 9500,
    institutionId: 11,
    name: mainInput.name,
    sebConfigPurpose: "START_EXAM",
    sebServerPingTime: 3000,
    vdiSetup: "NO",
    sebServerFallback: true,
    active: true,
};

test.describe("04 Connection Configurations - CREATE", () => {
    test.use({ timezoneId: "UTC" });

    test("A builds the create request from the form fields and redirects to the list", async ({
        connectionConfigurationCreate,
    }) => {
        const page = connectionConfigurationCreate.page;

        await page.route(CONNECTION_CONFIG_CREATE_REQUEST, async (route) => {
            if (route.request().method() !== "POST") {
                return route.continue();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(createdConfig),
            });
        });

        const createRequest = waitForRequest(
            page,
            "POST",
            CONNECTION_CONFIG_CREATE_REQUEST,
        );

        await connectionConfigurationCreate.goto();
        await connectionConfigurationCreate.fillForm(mainInput);
        await connectionConfigurationCreate.enableFallback();
        await connectionConfigurationCreate.fillFallback(fallbackInput);
        await connectionConfigurationCreate.submit();

        await test.step("the request carries the converted form values", async () => {
            // The create body is form-urlencoded, not JSON.
            const body = new URLSearchParams(
                (await createRequest).postData() ?? "",
            );
            expect(body.get("name")).toBe(mainInput.name);
            expect(body.get("sebConfigPurpose")).toBe("START_EXAM");
            expect(body.get("vdiSetup")).toBe("NO");
            expect(body.get("cert_encryption_asym")).toBe("false");
            // The password fields map onto the wire secret fields.
            expect(body.get("encryptSecret")).toBe(
                mainInput.configurationPassword,
            );
            expect(body.get("confirm_encrypt_secret")).toBe(
                mainInput.configurationPassword,
            );
            // Seconds entered in the form are sent as milliseconds on the wire.
            expect(body.get("sebServerPingTime")).toBe("3000");
            expect(body.get("sebServerFallback")).toBe("true");
            expect(body.get("startURL")).toBe(fallbackInput.fallbackStartUrl);
            expect(body.get("sebServerFallbackAttempts")).toBe("7");
            expect(body.get("sebServerFallbackAttemptInterval")).toBe("4000");
            expect(body.get("sebServerFallbackTimeout")).toBe("45000");
        });

        await test.step("the list opens filtered by the new name", async () => {
            await expect(page).toHaveURL(
                new RegExp(
                    `/connection-configuration\\?search=${createdConfig.name}`,
                ),
            );
        });
    });

    test("B blocks submit and shows field errors when required fields are empty", async ({
        connectionConfigurationCreate,
    }) => {
        const page = connectionConfigurationCreate.page;
        await connectionConfigurationCreate.goto();

        await expectNoRequest({
            page,
            method: "POST",
            urlRegex: CONNECTION_CONFIG_CREATE_REQUEST,
            action: () => connectionConfigurationCreate.submit(),
        });

        await connectionConfigurationCreate
            .field(CONNECTION_CONFIG_FIELD.name)
            .expectError();
        await expect(page).toHaveURL(/\/connection-configuration\/create/);
    });

    test("C cancel returns to the connection configuration list", async ({
        connectionConfigurationCreate,
    }) => {
        const page = connectionConfigurationCreate.page;
        await connectionConfigurationCreate.goto();

        await connectionConfigurationCreate.cancel();

        await expectToHaveUrl(page, "connection-configuration");
    });

    test("D surfaces a backend field error on the matching field", async ({
        connectionConfigurationCreate,
    }) => {
        const page = connectionConfigurationCreate.page;

        await page.route(CONNECTION_CONFIG_CREATE_REQUEST, async (route) => {
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
                        attributes: ["clientConfig", "name", "name.notunique"],
                    },
                ]),
            });
        });

        await connectionConfigurationCreate.goto();
        await connectionConfigurationCreate.fillForm(mainInput);
        await connectionConfigurationCreate.submit();

        await connectionConfigurationCreate
            .field(CONNECTION_CONFIG_FIELD.name)
            .expectError();
        await expect(page).toHaveURL(/\/connection-configuration\/create/);
    });
});
