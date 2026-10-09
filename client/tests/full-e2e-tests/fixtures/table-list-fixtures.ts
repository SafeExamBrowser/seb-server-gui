import { test as base } from "@playwright/test";

import { ExamTemplateCreateModel } from "../../shared/page-models/models/exam-template/exam-template-create.model.ts";
import { LoginPageModel } from "../../shared/page-models/models/user-account/login-page.model.ts"
import { UserAccountRegisterModel } from "../../shared/page-models/models/user-account/user-account-register.model.ts";
import { loginAsTestAdmin } from "../../utils/authenticate.ts";



type Fixtures = {
    login: LoginPageModel;
    register: UserAccountRegisterModel;
    examTemplateCreate: ExamTemplateCreateModel;
};

export const test = base.extend<Fixtures>({
    login: async ({ page }, use) => {
        await use(new LoginPageModel(page));
    },

    register: async ({ page }, use) => {
        await use(new UserAccountRegisterModel(page));
    },

    examTemplateCreate: async ({ page }, use) => {
        await loginAsTestAdmin(page);
        await use(new ExamTemplateCreateModel(page));
    },
});

export { expect } from "@playwright/test";
