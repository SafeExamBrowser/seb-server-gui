import { defineStore } from "pinia";
import { computed } from "vue";

import { usePersistedRef } from "@/composables/usePersistedRef";
import { AuthData } from "@/services/types";

type StorageItemName =
    | "sebAccessToken"
    | "sebRefreshToken"
    | "spAccessToken"
    | "spRefreshToken"
    | "refreshBefore";

const KEY_PREFIX = "auth___";

export const useAuthStore = defineStore("auth", () => {
    const sebAccessToken = usePersistedRef<StorageItemName>("sebAccessToken", {
        keyPrefix: KEY_PREFIX,
    });

    const sebRefreshToken = usePersistedRef<StorageItemName>(
        "sebRefreshToken",
        {
            keyPrefix: KEY_PREFIX,
        },
    );

    const spAccessToken = usePersistedRef<StorageItemName>("spAccessToken", {
        keyPrefix: KEY_PREFIX,
    });

    const spRefreshToken = usePersistedRef<StorageItemName>("spRefreshToken", {
        keyPrefix: KEY_PREFIX,
    });

    const refreshBefore = usePersistedRef<StorageItemName>("refreshBefore", {
        keyPrefix: KEY_PREFIX,
    });

    const updateAuthData = (authData: AuthData) => {
        sebAccessToken.value = authData.sebServer.access_token;
        sebRefreshToken.value = authData.sebServer.refresh_token;
        spAccessToken.value = authData.proctorServer.access_token;
        spRefreshToken.value = authData.proctorServer.refresh_token;
        refreshBefore.value = new Date(
            Date.now() +
                Math.min(
                    authData.sebServer.expires_in,
                    authData.proctorServer.expires_in,
                ),
        ).toISOString();
    };

    const $reset = () => {
        sebAccessToken.value = undefined;
        sebRefreshToken.value = undefined;
        spAccessToken.value = undefined;
        spRefreshToken.value = undefined;
        refreshBefore.value = undefined;
    };

    return {
        // getters
        sebAccessToken: computed(() => sebAccessToken.value),
        sebRefreshToken: computed(() => sebRefreshToken.value),
        spAccessToken: computed(() => spAccessToken.value),
        spRefreshToken: computed(() => spRefreshToken.value),
        refreshBefore: computed(() => refreshBefore.value),

        // actions
        updateAuthData,
        $reset,
    };
});
