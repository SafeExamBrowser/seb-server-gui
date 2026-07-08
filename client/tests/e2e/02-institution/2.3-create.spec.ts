import { test, expect } from "../shared/fixtures/table-list-fixtures";
import { expectNoRequest, waitForRequest } from "../utils/networkAssertions";
import { expectToHaveUrl } from "../utils/helpers";
import {
    INSTITUTION_CREATE_REQUEST,
    INSTITUTION_FIELD,
} from "./models/institution-create.model";

const input = {
    name: "E2ECreateInstitution",
    urlSuffix: "e2e-create-institution",
};

const createdInstitution = {
    id: 101,
    name: input.name,
    urlSuffix: input.urlSuffix,
    active: true,
};

test.describe("02 Institutions - CREATE", () => {
    test("A builds the create request from the form fields and redirects to the list", async ({
        institutionCreate,
    }) => {
        const page = institutionCreate.page;

        await page.route(INSTITUTION_CREATE_REQUEST, async (route) => {
            if (route.request().method() !== "POST") {
                return route.continue();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(createdInstitution),
            });
        });

        const createRequest = waitForRequest(
            page,
            "POST",
            INSTITUTION_CREATE_REQUEST,
        );

        await institutionCreate.goto();
        await institutionCreate.fillForm(input);
        await institutionCreate.submit();

        await test.step("the request carries the values entered in the form", async () => {
            const body = new URLSearchParams(
                (await createRequest).postData() ?? "",
            );
            expect(body.get("name")).toBe(input.name);
            expect(body.get("urlSuffix")).toBe(input.urlSuffix);
            expect(body.has("logoImage")).toBe(false);
        });

        await test.step("the list opens filtered by the new institution name", async () => {
            await expect(page).toHaveURL(
                new RegExp(`/institution\\?search=${input.name}`),
            );
        });
    });

    test("B blocks submit and shows field errors when required fields are empty", async ({
        institutionCreate,
    }) => {
        const page = institutionCreate.page;
        await institutionCreate.goto();

        await expectNoRequest({
            page,
            method: "POST",
            urlRegex: INSTITUTION_CREATE_REQUEST,
            action: () => institutionCreate.submit(),
        });

        await institutionCreate.field(INSTITUTION_FIELD.name).expectError();
        await expect(page).toHaveURL(/\/institution\/create/);
    });

    test("C cancel returns to the institution list", async ({
        institutionCreate,
    }) => {
        const page = institutionCreate.page;
        await institutionCreate.goto();

        await institutionCreate.cancel();

        await expectToHaveUrl(page, "institution");
    });

    test("D surfaces a backend field error on the matching field", async ({
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
                        attributes: ["institution", "name", "name.notunique"],
                    },
                ]),
            });
        });

        await institutionCreate.goto();
        await institutionCreate.fillForm(input);
        await institutionCreate.submit();

        await institutionCreate.field(INSTITUTION_FIELD.name).expectError();
        await expect(page).toHaveURL(/\/institution\/create/);
    });
});
