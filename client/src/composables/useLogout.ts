import { useAuthStore } from "@/composables/store/useAuthStore";
import { navigateTo } from "@/router/navigation";
import { useUserAccountStore } from "@/stores/authentication/authenticationStore";
import * as constants from "@/utils/constants";

export const useLogout = () => {
    const authStore = useAuthStore();
    const userAccountStore = useUserAccountStore();

    const logout = () => {
        authStore.$reset();

        userAccountStore.setUserTimeZone("");
        userAccountStore.userAccount = null;

        navigateTo(constants.DEFAULT_ROUTE);
    };

    return { logout };
};
