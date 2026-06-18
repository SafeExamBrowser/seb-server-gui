import { useAuthStore } from "@/composables/store/useAuthStore";
import { clearCurrentUser } from "@/composables/useCurrentUser";
import * as authenticationService from "@/services/authenticationService";
import router from "@/router/router";

export const useLogout = () => {
    const authStore = useAuthStore();

    const logout = async (skipServerLogout: boolean = false) => {
        if (!skipServerLogout) {
            await authenticationService.logout();
        }

        authStore.$reset();
        clearCurrentUser();

        await router.push({ name: "/(public)/login/" });
    };

    return { logout };
};
