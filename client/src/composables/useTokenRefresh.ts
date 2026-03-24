import { useAuthStore } from "@/composables/store/useAuthStore";
import { ref, watch } from "vue";
import * as authenticationService from "@/services/authenticationService";
import { useLogout } from "@/composables/useLogout";
import { setTokenRefreshPromise } from "@/services/apiService";

const REFRESH_SAFETY_MARGIN_MILLISECONDS = 30 * 1000; // 30 seconds in milliseconds

export const useTokenRefresh = () => {
    const authStore = useAuthStore();
    const timerRef = ref<Awaited<ReturnType<typeof setTimeout>>>();

    const refresh = async () => {
        const sebRefreshToken = authStore.sebRefreshToken;
        const spsRefreshToken = authStore.spRefreshToken;

        if (!sebRefreshToken || !spsRefreshToken) {
            // one of the refresh tokens is missing:
            // - this should not happen in practice
            // - but as a safety measure, we ensure that the user is properly logged out in that case
            useLogout().logout();
            return;
        }

        try {
            const refreshResponse = await authenticationService.refresh({
                sebRefreshToken,
                spsRefreshToken,
            });

            authStore.updateAuthData(refreshResponse);
        } catch {
            useLogout().logout(true);
        }
    };

    const replaceRefreshTimer = (millisecondsUntilRefresh?: number) => {
        if (timerRef.value) {
            clearTimeout(timerRef.value);
            timerRef.value = undefined;
        }

        if (millisecondsUntilRefresh) {
            timerRef.value = setTimeout(refresh, millisecondsUntilRefresh);
        }
    };

    const handleRefreshBeforeChange = (newRefreshBefore?: string) => {
        if (!newRefreshBefore) {
            // user is not logged in – no refresh timer needed
            replaceRefreshTimer(undefined);
            return;
        }

        const millisecondsUntilExpiration =
            new Date(newRefreshBefore).getTime() - new Date().getTime();

        if (millisecondsUntilExpiration <= 0) {
            // refresh token is already expired - refresh now, blocking all other authenticated requests
            setTokenRefreshPromise(
                refresh().finally(() => {
                    // unblock all other authenticated requests again
                    setTokenRefreshPromise(undefined);
                }),
            );
            return;
        }

        if (millisecondsUntilExpiration <= REFRESH_SAFETY_MARGIN_MILLISECONDS) {
            // refresh token is about to expire – refresh now!
            refresh();
            return;
        }

        // refresh token is still valid – start a refresh timer
        replaceRefreshTimer(
            millisecondsUntilExpiration - REFRESH_SAFETY_MARGIN_MILLISECONDS,
        );
    };

    watch(() => authStore.refreshBefore, handleRefreshBeforeChange, {
        immediate: true, // this let's us react to the initial value too
    });
};
