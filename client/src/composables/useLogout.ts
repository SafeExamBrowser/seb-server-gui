import { useAuthStore } from "@/composables/store/useAuthStore";
import { navigateTo } from "@/router/navigation";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import * as constants from "@/utils/constants";
import * as authenticationService from "@/services/authenticationService";

export const useLogout = () => {
    const authStore = useAuthStore();
    const userAccountStore = useUserAccountStore();

    const logout = async (skipServerLogout: boolean = false) => {
        if (!skipServerLogout) {
            await authenticationService.logout();
        }

        authStore.$reset();
        userAccountStore.setUserTimeZone("");
        userAccountStore.userAccount = null;

        navigateTo(constants.DEFAULT_ROUTE);
    };

    return { logout };
};
