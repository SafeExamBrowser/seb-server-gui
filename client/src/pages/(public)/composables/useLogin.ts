import { ref } from "vue";
import * as authenticationService from "@/services/authenticationService.ts";
import { useAuthStore } from "@/composables/store/useAuthStore.ts";
import { AxiosError } from "axios";
import { navigateTo } from "@/router/navigation.ts";
import * as constants from "@/utils/constants.ts";

export const useLogin = () => {
    const errorI18nKey = ref<string>();
    const loading = ref(false);

    const authStore = useAuthStore();

    const login = async (username: string, password: string) => {
        errorI18nKey.value = undefined;
        loading.value = true;

        try {
            const authResponse = await authenticationService.authorize({
                userName: username,
                password: password,
            });

            authStore.updateAuthData(authResponse);

            navigateTo(constants.HOME_PAGE_ROUTE);
        } catch (err) {
            errorI18nKey.value =
                err instanceof AxiosError && err.status === 401
                    ? "login-error"
                    : "api-error";
        } finally {
            loading.value = false;
        }
    };

    return { errorI18nKey, loading, login };
};
