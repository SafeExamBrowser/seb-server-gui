import { useAuthStore } from "@/composables/store/useAuthStore";
import { ref, watch } from "vue";

const REFRESH_SAFETY_MARGIN_MILLISECONDS = 1 * 60 * 1000; // 1 minute in milliseconds

export const useTokenRefresh = () => {
    const timerRef = ref<Awaited<ReturnType<typeof setTimeout>>>();

    const refresh = async () => {
        // TODO @alain: call the refresh token endpoint here
        console.log("- - - -refresh token now!");
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

        if (millisecondsUntilExpiration <= REFRESH_SAFETY_MARGIN_MILLISECONDS) {
            // refresh token is expired – refresh now!
            refresh();
            return;
        }

        // refresh token is still valid – start a refresh timer
        replaceRefreshTimer(
            millisecondsUntilExpiration - REFRESH_SAFETY_MARGIN_MILLISECONDS,
        );
    };

    watch(() => useAuthStore().refreshBefore, handleRefreshBeforeChange, {
        immediate: true, // this let's us react to the initial value too
    });
};
