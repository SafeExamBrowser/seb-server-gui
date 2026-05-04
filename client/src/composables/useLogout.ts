import { useAuthStore } from "@/composables/store/useAuthStore";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import * as authenticationService from "@/services/authenticationService";

export const useLogout = () => {
    const authStore = useAuthStore();
    const userAccountStore = useUserAccountStore();

    const logout = async (skipServerLogout: boolean = false) => {
        if (!skipServerLogout) {
            await authenticationService.logout();
        }

        authStore.$reset();
        userAccountStore.userAccount = null;

        const { default: router } = await import("@/router/router");
        await router.push({ name: "/(public)/" });
    };

    return { logout };
};
