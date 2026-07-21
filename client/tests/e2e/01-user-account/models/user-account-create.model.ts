import { type Page } from "@playwright/test";

import {
    USER_ACCOUNT_FIELD,
    userAccountFormConfig,
} from "@/pages/(app)/user-account/userAccountFormConfig.ts";

import {
    type FormFieldSpec,
    FormPageModel,
} from "../../shared/page-models/model-pages/form-page.model";

const PREFIX = userAccountFormConfig.createTestPrefix;
const MAIN_FORM = `${PREFIX}-form`;
const ROLE_FORM = `${PREFIX}-role-form`;

const fields: FormFieldSpec[] = [
    {
        name: USER_ACCOUNT_FIELD.institutionId,
        type: "select",
        formTestId: MAIN_FORM,
    },
    { name: USER_ACCOUNT_FIELD.username, type: "text", formTestId: MAIN_FORM },
    { name: USER_ACCOUNT_FIELD.name, type: "text", formTestId: MAIN_FORM },
    { name: USER_ACCOUNT_FIELD.surname, type: "text", formTestId: MAIN_FORM },
    { name: USER_ACCOUNT_FIELD.email, type: "text", formTestId: MAIN_FORM },
    {
        name: USER_ACCOUNT_FIELD.timezone,
        type: "select",
        formTestId: MAIN_FORM,
    },
    {
        name: USER_ACCOUNT_FIELD.password,
        type: "password",
        formTestId: MAIN_FORM,
    },
    {
        name: USER_ACCOUNT_FIELD.confirmPassword,
        type: "password",
        formTestId: MAIN_FORM,
    },
    { name: USER_ACCOUNT_FIELD.role, type: "select", formTestId: ROLE_FORM },
];

export type UserAccountCreateInput = {
    institution: string;
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
};

export const USER_ACCOUNT_CREATE_REQUEST = /\/useraccount(?:$|\?)/i;

export class UserAccountCreateModel extends FormPageModel {
    constructor(page: Page) {
        super(page, {
            route: userAccountFormConfig.createRoute,
            testPrefix: PREFIX,
            fields,
        });
    }

    async fillForm(input: UserAccountCreateInput) {
        await this.fill({
            [USER_ACCOUNT_FIELD.institutionId]: input.institution,
            [USER_ACCOUNT_FIELD.username]: input.username,
            [USER_ACCOUNT_FIELD.name]: input.name,
            [USER_ACCOUNT_FIELD.surname]: input.surname,
            [USER_ACCOUNT_FIELD.email]: input.email,
            [USER_ACCOUNT_FIELD.password]: input.password,
            [USER_ACCOUNT_FIELD.confirmPassword]: input.password,
            [USER_ACCOUNT_FIELD.role]: input.role,
        });
    }
}
