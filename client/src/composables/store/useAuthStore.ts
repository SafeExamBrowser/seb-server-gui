import { defineStore } from "pinia";
import { ref, watch } from "vue";

type StorageItemName =
    | "sebAccessToken"
    | "sebRefreshToken"
    | "spAccessToken"
    | "spRefreshToken";

const LOCAL_STORAGE_KEY_PREFIX = "auth___";

const setLocalStorageItem = (key: StorageItemName, value: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, value);
};

const removeLocalStorageItem = (key: StorageItemName) => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + key);
};

const getLocalStorageItem = (key: StorageItemName): string | undefined => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);

    if (value == null) {
        return undefined;
    }

    return value;
};

const getInitialState = () => ({
    sebAccessToken: getLocalStorageItem("sebAccessToken"),
    sebRefreshToken: getLocalStorageItem("sebRefreshToken"),
    spAccessToken: getLocalStorageItem("spAccessToken"),
    spRefreshToken: getLocalStorageItem("spRefreshToken"),
});

export const useAuthStore = defineStore("auth", () => {
    const sebAccessToken = ref<string | undefined>(
        getInitialState().sebAccessToken,
    );

    const sebRefreshToken = ref<string | undefined>(
        getInitialState().sebRefreshToken,
    );

    const spAccessToken = ref<string | undefined>(
        getInitialState().spAccessToken,
    );

    const spRefreshToken = ref<string | undefined>(
        getInitialState().spRefreshToken,
    );

    watch(sebAccessToken, (value) => {
        if (value === undefined) {
            removeLocalStorageItem("sebAccessToken");
            return;
        }

        setLocalStorageItem("sebAccessToken", value);
    });

    watch(sebRefreshToken, (value) => {
        if (value === undefined) {
            removeLocalStorageItem("sebRefreshToken");
            return;
        }

        setLocalStorageItem("sebRefreshToken", value);
    });

    watch(spAccessToken, (value) => {
        if (value === undefined) {
            removeLocalStorageItem("spAccessToken");
            return;
        }

        setLocalStorageItem("spAccessToken", value);
    });

    watch(spRefreshToken, (value) => {
        if (value === undefined) {
            removeLocalStorageItem("spRefreshToken");
            return;
        }

        setLocalStorageItem("spRefreshToken", value);
    });

    const $reset = () => {
        sebAccessToken.value = undefined;
        sebRefreshToken.value = undefined;
        spAccessToken.value = undefined;
        spRefreshToken.value = undefined;
    };

    return {
        sebAccessToken,
        sebRefreshToken,
        spAccessToken,
        spRefreshToken,
        $reset,
    };
});
