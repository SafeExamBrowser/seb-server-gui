import { expect, type Locator, type Page } from "@playwright/test";

import { ERROR_STATE_TEST_ID } from "@/components/widgets/errorState/errorStateContracts.ts";

export class ErrorStateModel {
    readonly root: Locator;

    constructor(page: Page) {
        this.root = page.getByTestId(ERROR_STATE_TEST_ID);
    }

    async expectVisible() {
        await expect(this.root).toBeVisible();
    }
}
