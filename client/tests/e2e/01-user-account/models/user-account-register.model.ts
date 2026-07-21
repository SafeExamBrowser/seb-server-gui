import { type Page } from "@playwright/test";

import { USER_ACCOUNT_FIELD } from "@/pages/(app)/user-account/userAccountFormConfig.ts";

import {
    type FormFieldSpec,
    FormPageModel,
} from "../../shared/page-models/model-pages/form-page.model";

const ROUTE = "/register";
const PREFIX = "register";
const FORM = "register-form";

// The public register page renders a single form and uses its own submit button
// id, so we override saveTestId rather than the `${prefix}-save-button` default.
const fields: FormFieldSpec[] = [
    {
        name: USER_ACCOUNT_FIELD.institutionId,
        type: "select",
        formTestId: FORM,
    },
    { name: USER_ACCOUNT_FIELD.username, type: "text", formTestId: FORM },
    { name: USER_ACCOUNT_FIELD.name, type: "text", formTestId: FORM },
    { name: USER_ACCOUNT_FIELD.surname, type: "text", formTestId: FORM },
    { name: USER_ACCOUNT_FIELD.email, type: "text", formTestId: FORM },
    { name: USER_ACCOUNT_FIELD.timezone, type: "select", formTestId: FORM },
    { name: USER_ACCOUNT_FIELD.password, type: "password", formTestId: FORM },
    {
        name: USER_ACCOUNT_FIELD.confirmPassword,
        type: "password",
        formTestId: FORM,
    },
];

export type RegisterInput = {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
};

export const REGISTER_REQUEST = /\/register(?:$|\?)/i;
export const INSTITUTION_INFO_REQUEST = /\/info\/institution(?:$|\?)/i;

export class UserAccountRegisterModel extends FormPageModel {
    constructor(page: Page) {
        super(page, {
            route: ROUTE,
            testPrefix: PREFIX,
            fields,
            saveTestId: "register-submit-btn",
        });
    }

    // Institution auto-selects when a single one is available, and the timezone
    // defaults from the browser, so only the remaining required fields are filled.
    async fillForm(input: RegisterInput) {
        await this.fill({
            [USER_ACCOUNT_FIELD.username]: input.username,
            [USER_ACCOUNT_FIELD.name]: input.name,
            [USER_ACCOUNT_FIELD.surname]: input.surname,
            [USER_ACCOUNT_FIELD.email]: input.email,
            [USER_ACCOUNT_FIELD.password]: input.password,
            [USER_ACCOUNT_FIELD.confirmPassword]: input.password,
        });
    }
}
