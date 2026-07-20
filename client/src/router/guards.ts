import type { Router } from "vue-router";
import i18n from "@/i18n";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { currentUserQueryOptions } from "@/composables/useCurrentUser";
import { guiAbilitiesQueryOptions } from "@/composables/useGuiAbilities";
import { queryClient } from "@/services/http/queryClient";

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
    try {
        await Promise.all([
            queryClient.ensureQueryData(currentUserQueryOptions()),
            queryClient.ensureQueryData(guiAbilitiesQueryOptions()),
        ]);
    } catch {
        return;
    }
}
