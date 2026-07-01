import { type Page } from "@playwright/test";
import { ConfirmButtonModel } from "../widgets/confirm-button.model";
import {
    FormFieldModel,
    type FormFieldType,
} from "../widgets/form-field.model";

export type FormFieldSpec = {
    name: string;
    type: FormFieldType;
    formTestId: string;
};

export type FormPageConfig = {
    route: string;
    testPrefix: string;
    fields: FormFieldSpec[];
    // Forms whose confirm/cancel buttons don't follow the `${testPrefix}-save-button`
    // convention (e.g. the public register page) can point at their own test ids.
    saveTestId?: string;
    cancelTestId?: string;
};

export class FormPageModel {
    readonly page: Page;
    readonly config: FormPageConfig;
    readonly saveButton: ConfirmButtonModel;
    readonly cancelButton: ConfirmButtonModel;
    private readonly fieldModels: Map<string, FormFieldModel>;

    constructor(page: Page, config: FormPageConfig) {
        this.page = page;
        this.config = config;
        this.saveButton = new ConfirmButtonModel(
            page,
            config.saveTestId ?? `${config.testPrefix}-save-button`,
        );
        this.cancelButton = new ConfirmButtonModel(
            page,
            config.cancelTestId ?? `${config.testPrefix}-cancel-button`,
        );
        this.fieldModels = new Map(
            config.fields.map((field) => [
                field.name,
                new FormFieldModel(
                    page,
                    `${field.formTestId}-field-${field.name}`,
                    field.type,
                ),
            ]),
        );
    }

    field(name: string): FormFieldModel {
        const model = this.fieldModels.get(name);
        if (!model) {
            throw new Error(`No form field registered for "${name}"`);
        }
        return model;
    }

    async goto() {
        await this.page.goto(this.config.route);
        await this.saveButton.expectVisible();
        const [first] = this.config.fields;
        if (first) {
            await this.field(first.name).expectVisible();
        }
    }

    async fill(values: Record<string, string>) {
        for (const [name, value] of Object.entries(values)) {
            await this.field(name).set(value);
        }
    }

    async submit() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }
}
