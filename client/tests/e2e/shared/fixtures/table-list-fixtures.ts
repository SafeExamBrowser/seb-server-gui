import { test as base } from "@playwright/test";
import { loginAsServerAdmin } from "../../utils/authenticate";
import { UserAccountsListModel } from "../../01-user-account/models/user-accounts-list.model";
import { InstitutionsListModel } from "../../02-institution/models/institutions-list.model";

type Fixtures = {
    userAccounts: UserAccountsListModel;
    institutions: InstitutionsListModel;
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
});

export { expect } from "@playwright/test";
