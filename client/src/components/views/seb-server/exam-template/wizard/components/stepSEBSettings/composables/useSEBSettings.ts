import { computed } from "vue";
import { getTemporaryConfigTemplate } from "./api/useGetTemporaryConfigTemplate";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";

export const useSEBSettings = () => {
    const sebSettingsStore = useSEBSettingsStore();
    sebSettingsStore.$reset();

    const {
        data: temporaryConfigTemplateKey,
        loading: loadingTemporaryConfigTemplateKey,
        error: errorTemporaryConfigTemplateKey,
    } = getTemporaryConfigTemplate();

    const loading = computed(() => loadingTemporaryConfigTemplateKey.value);

    const errors = computed(() =>
        [errorTemporaryConfigTemplateKey.value].filter(
            (error) => error !== undefined,
        ),
    );

    return {
        temporaryConfigTemplateKey,
        loading,
        errors,
    };
};
