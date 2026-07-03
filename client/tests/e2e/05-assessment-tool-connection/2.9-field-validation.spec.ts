import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { ASSESSMENT_TOOL_FIELD } from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";
import { ASSESSMENT_TOOL_CREATE_REQUEST } from "./models/assessment-tool-create.model";

// Valid form input: every case submits a form the frontend rules accept, so the POST always
// fires and the BACKEND is what "rejects" it. That isolates the frontend's backend-error
// handling (does each backend rule land on the right field with the right message?).
const validMainInput = {
    name: "e2e-field-validation-tool",
    // The MOCKUP option renders as "Testing".
    lmsType: "Testing",
    lmsUrl: "https://lms.example.com",
};

const validToken = "e2e-valid-token";

const validProxy = {
    proxyHost: "proxy.example.com",
    proxyPort: "8080",
    proxyUsername: "proxyuser",
    proxyPassword: "proxypw",
};

const MANDATORY = "This field is mandatory";

// One row per backend validation rule the create form can receive on a field. `attributes` is
// the wire `[domain, wireField, rule, ...ruleParams]` array; the frontend maps `wireField` onto
// the form field (directly, or via ASSESSMENT_TOOL_FIELD_ALIASES: lmsRestApiToken->accessToken,
// lmsProxyHost->proxyHost, lmsProxyPort->proxyPort, lmsProxyAuthUsername->proxyUsername,
// lmsProxyAuthSecret->proxyPassword) and renders the message from errors.backend.validation.*.
// Proxy fields only exist once the proxy switch is on.
type ValidationCase = {
    title: string;
    field: string;
    attributes: string[];
    message: string;
    requiresProxy?: boolean;
};

const cases: ValidationCase[] = [
    {
        title: "name mandatory",
        field: ASSESSMENT_TOOL_FIELD.name,
        attributes: ["lmsSetup", "name", "notNull"],
        message: MANDATORY,
    },
    {
        title: "name size",
        field: ASSESSMENT_TOOL_FIELD.name,
        attributes: ["lmsSetup", "name", "size", "3", "255"],
        message: "The size must be between 3 and 255",
    },
    {
        title: "lms type mandatory",
        field: ASSESSMENT_TOOL_FIELD.lmsType,
        attributes: ["lmsSetup", "lmsType", "notNull"],
        message: MANDATORY,
    },
    {
        title: "server address invalid url",
        field: ASSESSMENT_TOOL_FIELD.lmsUrl,
        attributes: ["lmsSetup", "lmsUrl", "invalidURL"],
        message: "The input does not match the URL pattern",
    },
    {
        title: "rest api token mandatory (aliased)",
        field: ASSESSMENT_TOOL_FIELD.accessToken,
        attributes: ["lmsSetup", "lmsRestApiToken", "notNull"],
        message: MANDATORY,
    },
    {
        title: "proxy host mandatory (aliased)",
        field: ASSESSMENT_TOOL_FIELD.proxyHost,
        attributes: ["lmsSetup", "lmsProxyHost", "notNull"],
        message: MANDATORY,
        requiresProxy: true,
    },
];

test.describe("05 Assessment Tools - BACKEND FIELD VALIDATION", () => {
    for (const validationCase of cases) {
        test(`maps the backend "${validationCase.title}" error onto its field`, async ({
            assessmentToolCreate,
        }) => {
            const page = assessmentToolCreate.page;

            await page.route(ASSESSMENT_TOOL_CREATE_REQUEST, async (route) => {
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
            });

            await assessmentToolCreate.goto();
            await assessmentToolCreate.fillForm(validMainInput);
            await assessmentToolCreate.fillAuthToken(validToken);
            if (validationCase.requiresProxy) {
                await assessmentToolCreate.enableProxy();
                await assessmentToolCreate.fillProxy(validProxy);
            }
            await assessmentToolCreate.submit();

            await assessmentToolCreate
                .field(validationCase.field)
                .expectError(validationCase.message);
            await expect(page).toHaveURL(/\/assessment-tool\/create/);
        });
    }
});
