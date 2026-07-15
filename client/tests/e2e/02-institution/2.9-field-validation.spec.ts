import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { INSTITUTION_CREATE_REQUEST } from "./models/institution-create.model";
import { INSTITUTION_FIELD } from "./models/institution-create.model";

// Valid form input: every case submits a form the frontend rules accept, so the POST always
// fires and the BACKEND is what "rejects" it. That isolates the frontend's backend-error
// handling (does each backend rule land on the right field with the right message?).
const validInput = {
    name: "e2e-field-validation-institution",
    urlSuffix: "e2e-field-validation",
};

const MANDATORY = "This field is mandatory";

// One row per backend validation rule the create form can receive on a field. `attributes` is
// the wire `[domain, wireField, rule, ...ruleParams]` array the backend splits a message into;
// the frontend maps `wireField` directly onto the form field and renders the message from
// errors.backend.validation.*.
type ValidationCase = {
    title: string;
    field: string;
    attributes: string[];
    message: string;
};

const cases: ValidationCase[] = [
    {
        title: "name mandatory",
        field: INSTITUTION_FIELD.name,
        attributes: ["institution", "name", "notNull"],
        message: MANDATORY,
    },
    {
        title: "name size",
        field: INSTITUTION_FIELD.name,
        attributes: ["institution", "name", "size", "3", "255"],
        message: "The size must be between 3 and 255",
    },
    {
        title: "name already in use",
        field: INSTITUTION_FIELD.name,
        attributes: ["institution", "name", "name.notunique"],
        message: "This name is already in use. Please choose another one.",
    },
    {
        title: "url suffix size",
        field: INSTITUTION_FIELD.urlSuffix,
        attributes: ["institution", "urlSuffix", "size", "3", "45"],
        message: "The size must be between 3 and 45",
    },
    {
        title: "url suffix validation",
        field: INSTITUTION_FIELD.urlSuffix,
        attributes: ["institution", "urlSuffix", "urlSuffix", "3", "45"],
        message: "The URL suffix must have a size between 3 and 45 characters",
    },
];

test.describe("02 Institutions - BACKEND FIELD VALIDATION", () => {
    for (const validationCase of cases) {
        test(`maps the backend "${validationCase.title}" error onto its field`, async ({
            institutionCreate,
        }) => {
            const page = institutionCreate.page;

            await page.route(INSTITUTION_CREATE_REQUEST, async (route) => {
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

            await institutionCreate.goto();
            await institutionCreate.fillForm(validInput);
            await institutionCreate.submit();

            await institutionCreate
                .field(validationCase.field)
                .expectError(validationCase.message);
            await expect(page).toHaveURL(/\/institution\/create/);
        });
    }
});
