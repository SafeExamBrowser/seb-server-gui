import { test as base } from "@playwright/test";

import { LoginPageModel } from "../../01-public/models/login.model";
import { RegisterModel } from "../../01-public/models/register.model";
import { ExamTemplateCreateModel } from "../../03-exam-template/models/exam-template-create.model.ts";
import { loginAsTestAdmin } from "../../utils/authenticate.ts";



type Fixtures = {
    login: LoginPageModel;
    register: RegisterModel;
    examTemplateCreate: ExamTemplateCreateModel;
};

export const test = base.extend<Fixtures>({
    login: async ({ page }, use) => {
        await use(new LoginPageModel(page));
    },

    register: async ({ page }, use) => {
        await use(new RegisterModel(page));
    },

    examTemplateCreate: async ({ page }, use) => {
        await loginAsTestAdmin(page);
        await use(new ExamTemplateCreateModel(page));
    },
});

export { expect } from "@playwright/test";
