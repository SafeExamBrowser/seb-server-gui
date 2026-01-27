import { ref } from "vue";
import * as authenticationService from "@/services/authenticationService";
import { useAuthStore } from "@/stores/authentication/authenticationStore";

export const useLogin = () => {
    const data =
        ref<Awaited<ReturnType<typeof authenticationService.authorize>>>();
    const error = ref<string>();
    const loading = ref(false);

    const authStore = useAuthStore();

    const login = async (username: string, password: string) => {
        error.value = undefined;
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
            error.value = err instanceof Error ? err.message : "Login failed";
        } finally {
            loading.value = false;
        }
    };

    return { data, error, loading, login };
};
