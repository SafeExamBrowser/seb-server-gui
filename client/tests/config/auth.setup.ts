import { test as setup } from "@playwright/test";

import { installMockBackend } from "../e2e-tests/mocks/mock-backend.ts";
import { loginAsServerAdmin } from "../utils/authenticate.ts";
import { SERVER_ADMIN_STORAGE_STATE } from "./auth.ts";

setup("login as server admin", async ({ page }, testInfo) => {
    await installMockBackend(page, testInfo.project.name);
    await loginAsServerAdmin(page);
    await page.context().storageState({ path: SERVER_ADMIN_STORAGE_STATE });
});
