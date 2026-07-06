import { expect, type Locator, type Page } from "@playwright/test";
import { selectVuetifyOptionByName } from "../../../utils/helpers";

export type FormFieldType =
    | "text"
    | "password"
    | "textarea"
    | "number"
    | "select"
    | "switch"
    | "file";

export type FormFieldFile = {
    name: string;
    mimeType: string;
    buffer: Buffer;
};

export class FormFieldModel {
    readonly page: Page;
    readonly testId: string;
    readonly type: FormFieldType;
    readonly root: Locator;

    constructor(page: Page, testId: string, type: FormFieldType) {
        this.page = page;
        this.testId = testId;
        this.type = type;
        this.root = page.getByTestId(testId);
    }

    get input(): Locator {
        return this.root.locator("input, textarea").first();
    }

    async fill(value: string) {
        await this.input.fill(value);
    }

    async select(optionText: string) {
        await selectVuetifyOptionByName(this.page, this.root, optionText);
    }

    async toggle() {
        // Vuetify's v-switch renders an <input type="checkbox"> (role "checkbox", not "switch").
        await this.root.getByRole("checkbox").click();
    }

    async setFile(file: FormFieldFile) {
        await this.root.locator('input[type="file"]').setInputFiles(file);
    }

    async set(value: string) {
        if (this.type === "select") {
            await this.select(value);
            return;
        }
        if (this.type === "switch") {
            await this.toggle();
            return;
        }
        await this.fill(value);
    }

    async expectVisible() {
        await expect(this.root).toBeVisible();
    }

    async expectValue(value: string) {
        await expect(this.input).toHaveValue(value);
    }

    async expectError(message?: string) {
        const error = this.root.locator(".v-messages__message").first();
        await expect(error).toBeVisible();
        if (message !== undefined) {
            await expect(error).toContainText(message);
        }
    }
}
