import { expect, Page, test, TestInfo } from "@playwright/test";
import { loginAsServerAdmin } from "../utils/authenticate";
import { addBrowserSuffixToText } from "../utils/helpers";
import { PlaywrightUserAccountsPage } from "./models/playwright-user-accounts-page";

test.describe("1.3.1 User Accounts - UPDATE Edit", () => {
    let userAccountsPage: PlaywrightUserAccountsPage;

    async function openEditUserForTest(
        page: Page,
        testInfo: TestInfo,
        baseUuid: string,
        baseLastName: string,
    ) {
        const suffix = testInfo.project.name.toLowerCase();
        const uuid = addBrowserSuffixToText(baseUuid, testInfo);
        const lastName = addBrowserSuffixToText(baseLastName, testInfo);

        await userAccountsPage.search(lastName);
        const userAccountPage = await userAccountsPage.clickEditIcon(uuid);

        await userAccountPage.expectVisible();
        await userAccountPage.expectStillOnEditPage(uuid);

        await userAccountPage.expectFormLoaded({
            name: "Institutional",
            surname: lastName,
            email: `inst-admin-${baseLastName}-${suffix}@nomail.nomail`,
        });

        return { userAccountPage, uuid, lastName };
    }

    test.beforeEach(async ({ page }) => {
        await loginAsServerAdmin(page);

        userAccountsPage = new PlaywrightUserAccountsPage(page);
        await userAccountsPage.goto();
        await userAccountsPage.expectVisible();
    });

    test("A Success", async ({ page }, testInfo) => {
        const { userAccountPage } = await openEditUserForTest(
            page,
            testInfo,
            "seb-user-account-edit-a",
            "testedit-a",
        );

        const unique = `e2e-1.3.A-${Date.now()}`;

        await userAccountPage.fillEditForm({
            name: `${unique}-Name`,
            surname: `${unique}-Surname`,
            username: `${unique}-Username`,
            email: `${unique}@email.com`,
            pickFirstTimezone: true,
            roleName: "Exam Administrator",
        });

        await userAccountPage.toggleStatusChip();

        await expect(userAccountPage.saveChangesButton).toBeEnabled();

        await userAccountPage.expectEditRequestSucceeded(async () => {
            await userAccountPage.submitSaveChanges();
        });

        await userAccountPage.expectRedirectToUserAccounts();
    });

    test("B Validation Failure", async ({ page }, testInfo) => {
        const REQUIRED = "This field is required";

        const { userAccountPage, uuid } = await openEditUserForTest(
            page,
            testInfo,
            "seb-user-account-edit-b",
            "testedit-b",
        );

        await userAccountPage.fillEditForm({
            name: "",
            surname: "",
            username: "",
        });

        await userAccountPage.expectNoEditRequest(async () => {
            await userAccountPage.submitSaveChanges();
        });

        await userAccountPage.expectRequiredFieldErrors({
            name: REQUIRED,
            surname: REQUIRED,
            username: REQUIRED,
        });

        await userAccountPage.expectStillOnEditPage(uuid);
    });

    test("C Server Error - duplicate username", async ({ page }, testInfo) => {
        const { userAccountPage, uuid } = await openEditUserForTest(
            page,
            testInfo,
            "seb-user-account-edit-c",
            "testedit-c",
        );

        await userAccountPage.fillEditForm({
            username: "createtests",
        });

        await userAccountPage.expectEditRequestFailed({
            action: async () => {
                await userAccountPage.submitSaveChanges();
            },
        });

        await userAccountPage.expectErrorToast([
            "Field validation error",
            "Username is already being used.",
        ]);

        await userAccountPage.expectStillOnEditPage(uuid);
    });
});
