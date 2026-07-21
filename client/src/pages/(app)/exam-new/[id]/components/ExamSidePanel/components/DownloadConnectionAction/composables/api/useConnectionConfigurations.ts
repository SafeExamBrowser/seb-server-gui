import { watch } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import { getConnectionConfigurationsActive } from "@/services/seb-server/connectionConfigurationInfoService.ts";

export const useConnectionConfigurations = (enabled: () => boolean) => {
    const fetch = useFetch(() => getConnectionConfigurationsActive());

    // The configurations are global reference data, so one fetch per mount is enough.
    // `enabled` can flip back to true when the exam status changes, hence the guard.
    let requested = false;

    watch(
        enabled,
        (isEnabled) => {
            if (!isEnabled || requested) {
                return;
            }

            requested = true;
            fetch.fetchData();
        },
        { immediate: true },
    );

    return fetch;
};
