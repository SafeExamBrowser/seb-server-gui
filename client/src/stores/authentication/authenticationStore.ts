import { defineStore } from "pinia";
import { navigateTo } from "@/router/navigation";
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import * as constants from "@/utils/constants";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { ref } from "vue";
import { UserAccount } from "@/models/userAccount";

// ----------------------authentication---------------------------//
export const useAuthStore = defineStore("auth", () => {
    const redirectRoute: string = "";

    async function login(
        accessTokenString: string,
        refreshTokenString: string,
    ) {
        setStorageItem(StorageItemEnum.ACCESS_TOKEN, accessTokenString);
        setStorageItem(StorageItemEnum.REFRESH_TOKEN, refreshTokenString);

        await userAccountViewService.setPersonalUserAccount();

        if (useAuthStore().redirectRoute === "") {
            navigateTo(constants.HOME_PAGE_ROUTE);
        } else {
            let route: string = useAuthStore().redirectRoute;
            const subPath: string | null = import.meta.env.VITE_SUB_PATH;

            if (subPath != null && route.includes(subPath)) {
                route = route.replace(subPath, "");
            }

            navigateTo(route);
        }
    }

    async function loginSP(
        accessTokenString: string,
        refreshTokenString: string,
    ) {
        setStorageItem(StorageItemEnum.SP_ACCESS_TOKEN, accessTokenString);
        setStorageItem(StorageItemEnum.SP_REFRESH_TOKEN, refreshTokenString);
        setStorageItem(StorageItemEnum.IS_SP_AVAILABLE, "true");

        // setStorageItem()
    }

    async function logout() {
        //   await authenticationService.logLogout();

        setStorageItem(StorageItemEnum.ACCESS_TOKEN, "");
        setStorageItem(StorageItemEnum.REFRESH_TOKEN, "");
        setStorageItem(StorageItemEnum.SP_ACCESS_TOKEN, "");
        setStorageItem(StorageItemEnum.SP_REFRESH_TOKEN, "");
        setStorageItem(StorageItemEnum.IS_SP_AVAILABLE, "");

        useUserAccountStore().setUserTimeZone("");
        useUserAccountStore().userAccount = null;

        navigateTo(constants.DEFAULT_ROUTE);
    }

    function setStorageItem(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    function getStorageItem(key: string): string {
        const token: string | null = localStorage.getItem(key);
        if (token == null) {
            return key;
        }
        return token;
    }

    return {
        redirectRoute,
        login,
        loginSP,
        logout,
        setStorageItem,
        getStorageItem,
    };
});

// ---------------------account----------------------------//
export const useUserAccountStore = defineStore("account", () => {
    const userAccount = ref<UserAccount | null>();
    const isEditMode = ref<boolean>();
    const isAccountSelected = ref<boolean>(false);
    const selectedAccountId = ref<number>();

    function setUserTimeZone(userTimeZone: string) {
        localStorage.setItem("userTimeZone", userTimeZone);
    }

    function getUserTimeZone(): string {
        const userTimeZone: string | null =
            localStorage.getItem("userTimeZone");
        if (userTimeZone == null) {
            return "UTC";
        }
        return userTimeZone;
    }

    return {
        userAccount,
        isEditMode,
        isAccountSelected,
        selectedAccountId,
        setUserTimeZone,
        getUserTimeZone,
    };
});
