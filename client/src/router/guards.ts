import type { Router } from "vue-router";
import i18n from "@/i18n";
import { useAuthStore } from "@/composables/store/useAuthStore";
import {
    currentUserQueryKey,
    getCurrentUser,
} from "@/composables/useCurrentUser";
import { queryClient } from "@/services/http/queryClient";
import { getCurrentUserAccount } from "@/services/seb-server/userAccountService";

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
                return { name: "/(public)/login/" };
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
    if (getCurrentUser()) {
        return;
    }

    try {
        await queryClient.fetchQuery({
            queryKey: currentUserQueryKey(),
            queryFn: ({ signal }) => getCurrentUserAccount({ signal }),
        });
    } catch {
        return;
    }
}
