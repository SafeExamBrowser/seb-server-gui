import { useAuthStore } from "@/composables/store/useAuthStore";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import * as authenticationService from "@/services/authenticationService";
// Static import is safe despite the cycle (router → guards → userAccountService
// → apiService → useLogout → router): `router` is only read inside logout() at
// user-action time, after the cyclic init chain has fully resolved.
import router from "@/router/router";

export const useLogout = () => {
    const authStore = useAuthStore();
    const userAccountStore = useUserAccountStore();

    const logout = async (skipServerLogout: boolean = false) => {
        if (!skipServerLogout) {
            await authenticationService.logout();
        }

        authStore.$reset();
        userAccountStore.userAccount = null;

        await router.push({ name: "/(public)/login/" });
    };

    return { logout };
};
