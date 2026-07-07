import { ref } from "vue";
import * as authenticationService from "@/services/authenticationService.ts";
import { useAuthStore } from "@/composables/store/useAuthStore.ts";
import { RouteLocationAsRelative, useRouter } from "vue-router";
import { verifyOneTimeToken } from "@/services/authenticationService.ts";

export const useAutoLogin = () => {
    const loading = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();
    const error = ref<string>();

    const login = async (jwt: string) => {
        loading.value = true;

        try {
            // verify One Time Token on back-end
            const autoLoginData = await verifyOneTimeToken(jwt);

            // login with the verified auto login data
            const authResponse = await authenticationService.authorize({
                userName: autoLoginData.username,
                password: autoLoginData.userUUID,
            });

            authStore.updateAuthData(authResponse);

            // forward to requested page
            if (
                autoLoginData.redirect.actionName === "MONITOR_EXAM_FROM_LIST"
            ) {
                // forward to exam monitoring
                const target: RouteLocationAsRelative = {
                    name: "/(app)/monitoring/[examId]/",
                    params: {
                        examId: autoLoginData.redirect.entityKey.modelId,
                    },
                };
                await router.push(target);
                return;
            }

            // fallback forward to main page
            await router.push({ name: "/(public)/login/" });
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
            await router.push({ name: "/(public)/login/" });
        } finally {
            loading.value = false;
        }
    };

    return { loading, error, login };
};
