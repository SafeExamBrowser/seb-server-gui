import { expect, test } from "../fixtures/table-list-fixtures";
import { installMockBackend } from "../mocks/mock-backend";
import { LoginPageModel } from "../../shared/page-models/models/user-account/login-page.model.ts";
import { expectToHaveUrl } from "../../utils/helpers";

const unknownPath = "/this-route-does-not-exist";

test.describe("10 Layout - NOT FOUND PAGE", () => {
    test("A logged-out visitors are redirected to the login page", async ({
        page,
    }, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await page.goto(unknownPath);

        await new LoginPageModel(page).expectVisible();
        await expectToHaveUrl(page, "login");
    });

    test("B logged-in users see the 404 page inside the app layout", async ({
        notFoundPage,
    }) => {
        await notFoundPage.goto(unknownPath);

        await notFoundPage.expectVisible();
        await expect(notFoundPage.page).toHaveTitle(
            "Page not found | SEB Server",
        );
        expect(notFoundPage.page.url()).toContain(unknownPath);
    });

    test("C the back link returns to the landing page", async ({
        notFoundPage,
    }) => {
        await notFoundPage.goto(unknownPath);
        await notFoundPage.expectVisible();

        await notFoundPage.backToHome();
        await expectToHaveUrl(notFoundPage.page, "navigation-overview");
    });
});
