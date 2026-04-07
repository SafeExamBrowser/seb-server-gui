import { defineStore } from "pinia";
import { ref } from "vue";

export const useCreateConnectionConfigurationStore = defineStore(
    "createConnectionConfiguration",
    () => {
        const name = ref<string | undefined>(undefined);
        const configurationPurpose = ref<string | undefined>(undefined);
        const configurationPassword = ref<string | undefined>(undefined);
        const confirmConfigurationPassword = ref<string | undefined>(undefined);
        const encryptWithCertificate = ref<string | undefined>(undefined);
        const pingInterval = ref<number | undefined>(1);
        const asymmetricOnlyEncryption = ref<boolean>(false);

        const withFallback = ref<boolean>(false);
        const fallbackStartUrl = ref<string | undefined>(undefined);
        const connectionAttempts = ref<number | undefined>(5);
        const interval = ref<number | undefined>(2);
        const connectionTimeout = ref<number | undefined>(30);
        const fallbackPassword = ref<string | undefined>(undefined);
        const confirmFallbackPassword = ref<string | undefined>(undefined);
        const quitPassword = ref<string | undefined>(undefined);
        const confirmQuitPassword = ref<string | undefined>(undefined);

        function $reset() {
            name.value = undefined;
            configurationPurpose.value = undefined;
            configurationPassword.value = undefined;
            confirmConfigurationPassword.value = undefined;
            encryptWithCertificate.value = undefined;
            pingInterval.value = 1;
            asymmetricOnlyEncryption.value = false;
            withFallback.value = false;
            fallbackStartUrl.value = undefined;
            connectionAttempts.value = 5;
            interval.value = 2;
            connectionTimeout.value = 30;
            fallbackPassword.value = undefined;
            confirmFallbackPassword.value = undefined;
            quitPassword.value = undefined;
            confirmQuitPassword.value = undefined;
        }

        return {
            name,
            configurationPurpose,
            configurationPassword,
            confirmConfigurationPassword,
            encryptWithCertificate,
            pingInterval,
            asymmetricOnlyEncryption,
            withFallback,
            fallbackStartUrl,
            connectionAttempts,
            interval,
            connectionTimeout,
            fallbackPassword,
            confirmFallbackPassword,
            quitPassword,
            confirmQuitPassword,
            $reset,
        };
    },
);
