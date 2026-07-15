import { Page } from "@playwright/test";
import { expectToHaveUrl } from "./helpers";

const SEB_SERVER_ADMIN_USERNAME = "testmain";

const currentServerAdmin = {
    uuid: "e2e-server-admin",
    institutionId: 1,
    name: "Server",
    surname: "Administrator",
    username: SEB_SERVER_ADMIN_USERNAME,
    email: "testmain@example.com",
    active: true,
    language: "en",
    timezone: "Europe/Zurich",
    userRoles: ["SEB_SERVER_ADMIN"],
};

const currentInstitution = {
    id: currentServerAdmin.institutionId,
    name: "E2E Institution",
    urlSuffix: "e2e-institution",
    active: true,
};

async function mockCurrentServerAdmin(page: Page) {
    await page.route(
        /\/api\/admin-api\/v1\/useraccount\/me(?:$|\?)/i,
        async (route) => {
            if (route.request().method() !== "GET") {
                return route.continue();
            }

            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(currentServerAdmin),
            });
        },
    );

    await page.route(
        /\/api\/admin-api\/v1\/institution\/1(?:$|\?)/i,
        async (route) => {
            if (route.request().method() !== "GET") {
                return route.continue();
            }

            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(currentInstitution),
            });
        },
    );

    await page.route(
        /\/api\/(?:sps\/)?useraccount\/logout$/i,
        async (route) => {
            if (route.request().method() !== "POST") {
                return route.continue();
            }

            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: "",
            });
        },
    );
}

async function seedServerAdminAuth(page: Page) {
    const refreshBefore = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await page.addInitScript(
        ({ refreshBefore }) => {
            localStorage.setItem("auth___sebAccessToken", "e2e-seb-access");
            localStorage.setItem("auth___sebRefreshToken", "e2e-seb-refresh");
            localStorage.setItem("auth___spAccessToken", "e2e-sps-access");
            localStorage.setItem("auth___spRefreshToken", "e2e-sps-refresh");
            localStorage.setItem("auth___refreshBefore", refreshBefore);
        },
        { refreshBefore },
    );
}

export async function loginAsServerAdmin(page: Page) {
    await mockCurrentServerAdmin(page);
    await seedServerAdminAuth(page);
    await page.goto("/navigation-overview");

    await expectToHaveUrl(page, "navigation-overview");
}
