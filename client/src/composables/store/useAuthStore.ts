import { defineStore } from "pinia";
import { usePersistedRef } from "@/composables/usePersistedRef";

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

    const $reset = () => {
        sebAccessToken.value = undefined;
        sebRefreshToken.value = undefined;
        spAccessToken.value = undefined;
        spRefreshToken.value = undefined;
        refreshBefore.value = undefined;
    };

    return {
        sebAccessToken,
        sebRefreshToken,
        spAccessToken,
        spRefreshToken,
        refreshBefore,
        $reset,
    };
});
