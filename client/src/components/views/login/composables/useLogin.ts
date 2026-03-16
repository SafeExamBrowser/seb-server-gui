import { ref } from "vue";
import * as authenticationService from "@/services/authenticationService";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { AxiosError } from "axios";
import { navigateTo } from "@/router/navigation";
import * as constants from "@/utils/constants";

export const useLogin = () => {
    const data =
        ref<Awaited<ReturnType<typeof authenticationService.authorize>>>();
    const errorI18nKey = ref<string>();
    const loading = ref(false);

    const authStore = useAuthStore();

    const login = async (username: string, password: string) => {
        errorI18nKey.value = undefined;
        loading.value = true;

        try {
            const authResponse = await authenticationService.authorize(
                username,
                password,
            );

            data.value = authResponse;

            authStore.sebAccessToken = authResponse.sebServer.access_token;
            authStore.sebRefreshToken = authResponse.sebServer.refresh_token;
            authStore.spAccessToken = authResponse.proctorServer.access_token;
            authStore.spRefreshToken = authResponse.proctorServer.refresh_token;

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

    return { data, errorI18nKey, loading, login };
};
