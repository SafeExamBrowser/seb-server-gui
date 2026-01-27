import { ref } from "vue";
import * as authenticationService from "@/services/authenticationService";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import { AxiosError } from "axios";

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

            authStore.login(
                authResponse.sebServer.access_token,
                authResponse.sebServer.refresh_token,
            );

            authStore.loginSP(
                authResponse.proctorServer.access_token,
                authResponse.proctorServer.refresh_token,
            );
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
