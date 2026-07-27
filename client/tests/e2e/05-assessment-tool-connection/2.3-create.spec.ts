import { ASSESSMENT_TOOL_FIELD } from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";

import { expect, test } from "../shared/fixtures/table-list-fixtures";
import { expectToHaveUrl } from "../utils/helpers";
import { expectNoRequest, waitForRequest } from "../utils/networkAssertions";
import { ASSESSMENT_TOOL_CREATE_REQUEST } from "./models/assessment-tool-create.model";

const mainInput = {
    name: "e2e-create-assessment-tool",
    // The MOCKUP option renders as "Testing".
    lmsType: "Testing",
    lmsUrl: "https://lms.example.com",
};

const accessToken = "e2e-rest-api-token-123";

const proxyInput = {
    proxyHost: "proxy.example.com",
    proxyPort: "8080",
    proxyUsername: "proxyuser",
    proxyPassword: "proxypw",
};

// A `decodeWire(assessmentToolSchema)`-valid body so the post-create
// `router.push({ query: { search: created.name } })` lands on the filtered list.
const createdTool = {
    id: 9500,
    institutionId: 11,
    name: mainInput.name,
    lmsType: "MOCKUP",
    lmsUrl: mainInput.lmsUrl,
    active: true,
};

test.describe("05 Assessment Tools - CREATE", () => {
    test("A builds the create request from the form fields and redirects to the list", async ({
        assessmentToolCreate,
    }) => {
        const page = assessmentToolCreate.page;

        await page.route(ASSESSMENT_TOOL_CREATE_REQUEST, async (route) => {
            if (route.request().method() !== "POST") {
                return route.fallback();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(createdTool),
            });
        });

        const createRequest = waitForRequest(
            page,
            "POST",
            ASSESSMENT_TOOL_CREATE_REQUEST,
        );

        await assessmentToolCreate.goto();
        await assessmentToolCreate.fillForm(mainInput);
        await assessmentToolCreate.fillAuthToken(accessToken);
        await assessmentToolCreate.enableProxy();
        await assessmentToolCreate.fillProxy(proxyInput);
        await assessmentToolCreate.submit();

        await test.step("the request carries the form values", async () => {
            // The create body is form-urlencoded, not JSON.
            const body = new URLSearchParams(
                (await createRequest).postData() ?? "",
            );
            expect(body.get("name")).toBe(mainInput.name);
            // The "Testing" option maps onto the MOCKUP enum value on the wire.
            expect(body.get("lmsType")).toBe("MOCKUP");
            expect(body.get("lmsUrl")).toBe(mainInput.lmsUrl);
            // The institution is auto-filled from the authenticated user.
            expect(body.get("institutionId")).toBeTruthy();
            // Token auth maps onto the wire lmsRestApiToken field.
            expect(body.get("lmsRestApiToken")).toBe(accessToken);
            // Proxy fields map onto their lmsProxy* wire names.
            expect(body.get("lmsProxyHost")).toBe(proxyInput.proxyHost);
            expect(body.get("lmsProxyPort")).toBe(proxyInput.proxyPort);
            expect(body.get("lmsProxyAuthUsername")).toBe(
                proxyInput.proxyUsername,
            );
            expect(body.get("lmsProxyAuthSecret")).toBe(
                proxyInput.proxyPassword,
            );
        });

        await test.step("the list opens filtered by the new name", async () => {
            await expect(page).toHaveURL(
                new RegExp(`/assessment-tool\\?search=${createdTool.name}`),
            );
        });
    });

    test("B blocks submit and shows field errors when required fields are empty", async ({
        assessmentToolCreate,
    }) => {
        const page = assessmentToolCreate.page;
        await assessmentToolCreate.goto();

        await expectNoRequest({
            page,
            method: "POST",
            urlRegex: ASSESSMENT_TOOL_CREATE_REQUEST,
            action: () => assessmentToolCreate.submit(),
        });

        await assessmentToolCreate
            .field(ASSESSMENT_TOOL_FIELD.name)
            .expectError();
        await expect(page).toHaveURL(/\/assessment-tool\/create/);
    });

    test("C cancel returns to the assessment tool list", async ({
        assessmentToolCreate,
    }) => {
        const page = assessmentToolCreate.page;
        await assessmentToolCreate.goto();

        await assessmentToolCreate.cancel();

        await expectToHaveUrl(page, "assessment-tool");
    });

    test("D surfaces a backend field error on the matching field", async ({
        assessmentToolCreate,
    }) => {
        const page = assessmentToolCreate.page;

        await page.route(ASSESSMENT_TOOL_CREATE_REQUEST, async (route) => {
            if (route.request().method() !== "POST") {
                return route.fallback();
            }
            await route.fulfill({
                status: 400,
                contentType: "application/json",
                body: JSON.stringify([
                    {
                        messageCode: "1200",
                        systemMessage: "field validation error",
                        attributes: ["lmsSetup", "name", "name.notunique"],
                    },
                ]),
            });
        });

        await assessmentToolCreate.goto();
        await assessmentToolCreate.fillForm(mainInput);
        await assessmentToolCreate.fillAuthToken(accessToken);
        await assessmentToolCreate.submit();

        await assessmentToolCreate
            .field(ASSESSMENT_TOOL_FIELD.name)
            .expectError();
        await expect(page).toHaveURL(/\/assessment-tool\/create/);
    });

    test("E builds the client-credentials create request (the other auth branch)", async ({
        assessmentToolCreate,
    }) => {
        const page = assessmentToolCreate.page;

        await page.route(ASSESSMENT_TOOL_CREATE_REQUEST, async (route) => {
            if (route.request().method() !== "POST") {
                return route.fallback();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(createdTool),
            });
        });

        const createRequest = waitForRequest(
            page,
            "POST",
            ASSESSMENT_TOOL_CREATE_REQUEST,
        );

        await assessmentToolCreate.goto();
        await assessmentToolCreate.fillForm(mainInput);
        await assessmentToolCreate.fillAuthClient({
            username: "e2e-client-name",
            password: "e2e-client-secret",
        });
        await assessmentToolCreate.submit();

        // Client mode sends lmsClientname/lmsClientsecret and OMITS the token field.
        const body = new URLSearchParams(
            (await createRequest).postData() ?? "",
        );
        expect(body.get("lmsClientname")).toBe("e2e-client-name");
        expect(body.get("lmsClientsecret")).toBe("e2e-client-secret");
        expect(body.get("lmsRestApiToken")).toBeNull();
    });
});
