import { useAuthStore } from "@/composables/store/useAuthStore";
import { clearCurrentUser } from "@/composables/useCurrentUser";
import { clearGuiAbilities } from "@/composables/useGuiAbilities";
import router from "@/router/router";
import * as authenticationService from "@/services/authenticationService";
import { queryClient } from "@/services/http/queryClient";

export const useLogout = () => {
    const authStore = useAuthStore();

    const logout = async (skipServerLogout: boolean = false) => {
        if (!skipServerLogout) {
            await authenticationService.logout();
        }

        authStore.$reset();
        clearCurrentUser();
        clearGuiAbilities();

        await router.push({ name: "/(public)/login/" });

        // drop every cached query once the app pages are unmounted, so the
        // next login cannot see the previous user's data
        queryClient.clear();
    };

    return { logout };
};
