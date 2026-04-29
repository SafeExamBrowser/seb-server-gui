import { ref } from "vue";
import * as authenticationService from "@/services/authenticationService.ts";
import { useAuthStore } from "@/composables/store/useAuthStore.ts";
import { AxiosError } from "axios";
import { useRouter } from "vue-router";

export const useLogin = () => {
    const errorI18nKey = ref<string>();
    const loading = ref(false);
    const router = useRouter();
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

            await router.push({ name: "/(app)/home/" });
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
