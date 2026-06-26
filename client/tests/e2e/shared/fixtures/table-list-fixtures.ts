import { test as base } from "@playwright/test";
import { loginAsServerAdmin } from "../../utils/authenticate";
import { UserAccountsListModel } from "../../01-user-account/models/user-accounts-list.model";
import { UserAccountCreateModel } from "../../01-user-account/models/user-account-create.model";
import { UserAccountEditModel } from "../../01-user-account/models/user-account-edit.model";
import { UserAccountRegisterModel } from "../../01-user-account/models/user-account-register.model";
import { UserAccountProfileModel } from "../../01-user-account/models/user-account-profile.model";
import { ProfileMenuModel } from "../page-models/layout/profile-menu.model";
import { InstitutionsListModel } from "../../02-institution/models/institutions-list.model";
import { ConnectionConfigurationsListModel } from "../../04-connection-configuration/models/connection-configurations-list.model";
import { CertificatesListModel } from "../../03-certificate/models/certificates-list.model";
import { AssessmentToolsListModel } from "../../05-assessment-tool-connection/models/assessment-tools-list.model";

type Fixtures = {
    userAccounts: UserAccountsListModel;
    userAccountCreate: UserAccountCreateModel;
    userAccountEdit: UserAccountEditModel;
    userAccountRegister: UserAccountRegisterModel;
    userAccountProfile: UserAccountProfileModel;
    profileMenu: ProfileMenuModel;
    institutions: InstitutionsListModel;
    connectionConfigurations: ConnectionConfigurationsListModel;
    certificates: CertificatesListModel;
    assessmentTools: AssessmentToolsListModel;
};

export const test = base.extend<Fixtures>({
    userAccounts: async ({ page }, use) => {
        await loginAsServerAdmin(page);
        await use(new UserAccountsListModel(page));
    },
    userAccountCreate: async ({ page }, use) => {
        await loginAsServerAdmin(page);
        await use(new UserAccountCreateModel(page));
    },
    userAccountEdit: async ({ page }, use) => {
        await loginAsServerAdmin(page);
        await use(new UserAccountEditModel(page));
    },
    userAccountRegister: async ({ page }, use) => {
        // Register is a public page; it must work without authentication.
        await use(new UserAccountRegisterModel(page));
    },
    userAccountProfile: async ({ page }, use) => {
        await loginAsServerAdmin(page);
        await use(new UserAccountProfileModel(page));
    },
    profileMenu: async ({ page }, use) => {
        await loginAsServerAdmin(page);
        await use(new ProfileMenuModel(page));
    },
    institutions: async ({ page }, use) => {
        await loginAsServerAdmin(page);
        await use(new InstitutionsListModel(page));
    },
    connectionConfigurations: async ({ page }, use) => {
        await loginAsServerAdmin(page);
        await use(new ConnectionConfigurationsListModel(page));
    },
    certificates: async ({ page }, use) => {
        await loginAsServerAdmin(page);
        await use(new CertificatesListModel(page));
    },
    assessmentTools: async ({ page }, use) => {
        await loginAsServerAdmin(page);
        await use(new AssessmentToolsListModel(page));
    },
});

export { expect } from "@playwright/test";
