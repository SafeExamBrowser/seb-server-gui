import { test as base } from "@playwright/test";
import { loginAsServerAdmin } from "../../utils/authenticate";
import { UserAccountsListModel } from "../../01-user-account/models/user-accounts-list.model";
import { InstitutionsListModel } from "../../02-institution/models/institutions-list.model";
import { ConnectionConfigurationsListModel } from "../../04-connection-configuration/models/connection-configurations-list.model";
import { CertificatesListModel } from "../../03-certificate/models/certificates-list.model";

type Fixtures = {
    userAccounts: UserAccountsListModel;
    institutions: InstitutionsListModel;
    connectionConfigurations: ConnectionConfigurationsListModel;
    certificates: CertificatesListModel;
};

export const test = base.extend<Fixtures>({
    userAccounts: async ({ page }, use) => {
        await loginAsServerAdmin(page);
        await use(new UserAccountsListModel(page));
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
});

export { expect } from "@playwright/test";
