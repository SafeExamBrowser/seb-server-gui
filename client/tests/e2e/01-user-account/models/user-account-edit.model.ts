import { type Page } from "@playwright/test";
import {
    USER_ACCOUNT_FIELD,
    userAccountFormConfig,
} from "@/pages/(app)/user-account/userAccountFormConfig.ts";
import {
    FormPageModel,
    type FormFieldSpec,
} from "../../shared/page-models/model-pages/form-page.model";

export const EDIT_USER_UUID = "e2e-edit-account-uuid";

const PREFIX = userAccountFormConfig.editTestPrefix;
const MAIN_FORM = `${PREFIX}-form`;
const ROLE_FORM = `${PREFIX}-role-form`;

// Edit mode hides the inline password fields (they live behind the password
// dialog), so the editable set is the main form plus the role select.
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
    { name: USER_ACCOUNT_FIELD.role, type: "select", formTestId: ROLE_FORM },
];

export const userAccountByIdRequest = (uuid: string) =>
    new RegExp(`/useraccount/${uuid}(?:$|\\?)`, "i");

export const USER_ACCOUNT_SAVE_REQUEST = /\/useraccount(?:$|\?)/i;

export class UserAccountEditModel extends FormPageModel {
    constructor(page: Page, userUuid: string = EDIT_USER_UUID) {
        super(page, {
            route: userAccountFormConfig.editRoute(userUuid),
            testPrefix: PREFIX,
            fields,
        });
    }
}
