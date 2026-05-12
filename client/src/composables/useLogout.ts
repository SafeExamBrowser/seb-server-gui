import { useAuthStore } from "@/composables/store/useAuthStore";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import { clearCurrentUser } from "../components/layout/container/api/useCurrentUser";
import * as authenticationService from "@/services/authenticationService";
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
        clearCurrentUser();

        await router.push({ name: "/(public)/login/" });
    };

    return { logout };
};
