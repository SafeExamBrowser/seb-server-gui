import { type Page } from "@playwright/test";
import {
    USER_ACCOUNT_FIELD,
    userAccountFormConfig,
} from "@/pages/(app)/user-account/userAccountFormConfig.ts";
import {
    FormPageModel,
    type FormFieldSpec,
} from "../../shared/page-models/model-pages/form-page.model";
import { ChangePasswordDialogModel } from "../../shared/page-models/widgets/change-password-dialog.model";

const PREFIX = userAccountFormConfig.profileTestPrefix;
const MAIN_FORM = `${PREFIX}-form`;
const ROLE_FORM = `${PREFIX}-role-form`;

// Profile mode hydrates from the current user; the role select is read-only and
// the password lives behind the change-password dialog (same as edit).
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

// Current user load + profile save share the /useraccount base; matchers are
// method-aware (GET me, PUT save, POST password).
export const CURRENT_USER_REQUEST = /\/useraccount\/me(?:$|\?)/i;
export const PROFILE_SAVE_REQUEST = /\/useraccount(?:$|\?)/i;
export const CHANGE_PASSWORD_REQUEST = /\/useraccount\/password(?:$|\?)/i;

export class UserAccountProfileModel extends FormPageModel {
    readonly passwordDialog: ChangePasswordDialogModel;

    constructor(page: Page) {
        super(page, {
            route: userAccountFormConfig.profileRoute,
            testPrefix: PREFIX,
            fields,
        });
        this.passwordDialog = new ChangePasswordDialogModel(page);
    }

    async openPasswordDialog() {
        await this.page.getByTestId(`${PREFIX}-password-opener`).click();
        await this.passwordDialog.expectVisible();
    }
}
