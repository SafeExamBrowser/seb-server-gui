import { expect } from "../../e2e/shared/fixtures/table-list-fixtures.ts";
import { test } from "../shared/fixtures/table-list-fixtures";


test.describe("03 Exam Template - Start", () => {
    test.use({ timezoneId: "UTC" });

    test("A basic check", async ({ examTemplateCreate }) => {
        const page = examTemplateCreate.page;

        await examTemplateCreate.goto();

        await examTemplateCreate.expectStartPageVisible();
        //
        // await register.fillForm(registerUserValid1);
        //
        // await register.submit();

        // await expect(page.getByTestId("exam-template-step1")).toBeVisible();
    });

});
