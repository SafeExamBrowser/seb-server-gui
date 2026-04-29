import { useAuthStore } from "@/composables/store/useAuthStore";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import * as authenticationService from "@/services/authenticationService";
import { useRouter } from "vue-router";

export const useLogout = () => {
    const authStore = useAuthStore();
    const userAccountStore = useUserAccountStore();
    const router = useRouter();

    const logout = async (skipServerLogout: boolean = false) => {
        if (!skipServerLogout) {
            await authenticationService.logout();
        }

        authStore.$reset();
        userAccountStore.userAccount = null;

        await router.push({ name: "/(public)/" });
    };

    return { logout };
};
