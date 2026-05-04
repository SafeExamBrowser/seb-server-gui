import type { Router } from "vue-router";
import i18n from "@/i18n";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import type { UserAccount } from "@/models/userAccount";
import * as userAccountService from "@/services/seb-server/userAccountService";

const DEFAULT_TITLE = "SEB Server";
const TITLE_SUFFIX = " | SEB Server";

export function installGuards(router: Router): void {
    router.beforeEach(async (to) => {
        if (to.meta.requiresAuth) {
            const auth = useAuthStore();
            const isAuthenticated = Boolean(
                auth.sebAccessToken && auth.spAccessToken,
            );

            if (!isAuthenticated) {
                return { name: "/(public)/" };
            }

            await hydratePersonalUserAccount();
        }

        return true;
    });

    router.afterEach((to) => {
        const titleKey = to.meta.titleKey as string | undefined;

        if (titleKey) {
            document.title = i18n.global.t(titleKey) + TITLE_SUFFIX;
        } else {
            document.title = DEFAULT_TITLE;
        }
    });
}

async function hydratePersonalUserAccount(): Promise<void> {
    const userAccountStore = useUserAccountStore();

    try {
        if (userAccountStore.userAccount != null) return;

        const personalUserAccountResponse: UserAccount | null =
            await userAccountService.getPersonalUserAccount();

        if (personalUserAccountResponse == null) return;

        userAccountStore.userAccount = personalUserAccountResponse;
    } catch {
        return;
    }
}
