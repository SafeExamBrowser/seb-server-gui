import { defineStore } from "pinia";
import { ref } from "vue";

export type AuthMode = "client" | "token";

export const useCreateAssessmentToolStore = defineStore(
    "createAssessmentTool",
    () => {
        const institutionId = ref<string | undefined>(undefined);
        const name = ref<string | undefined>(undefined);
        const lmsType = ref<string | undefined>(undefined);
        const serverAddress = ref<string | undefined>(undefined);
        const authMode = ref<AuthMode>("token");
        const clientUsername = ref<string | undefined>(undefined);
        const clientPassword = ref<string | undefined>(undefined);
        const accessToken = ref<string | undefined>(undefined);
        const withProxy = ref<boolean>(false);
        const proxyHost = ref<string | undefined>(undefined);
        const proxyPort = ref<string | undefined>(undefined);
        const proxyUsername = ref<string | undefined>(undefined);
        const proxyPassword = ref<string | undefined>(undefined);

        function $reset() {
            institutionId.value = undefined;
            name.value = undefined;
            lmsType.value = undefined;
            serverAddress.value = undefined;
            authMode.value = "token";
            clientUsername.value = undefined;
            clientPassword.value = undefined;
            accessToken.value = undefined;
            withProxy.value = false;
            proxyHost.value = undefined;
            proxyPort.value = undefined;
            proxyUsername.value = undefined;
            proxyPassword.value = undefined;
        }

        return {
            institutionId,
            name,
            lmsType,
            serverAddress,
            authMode,
            clientUsername,
            clientPassword,
            accessToken,
            withProxy,
            proxyHost,
            proxyPort,
            proxyUsername,
            proxyPassword,
            $reset,
        };
    },
);
