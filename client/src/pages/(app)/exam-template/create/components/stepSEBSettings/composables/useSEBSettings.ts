import { computed } from "vue";

import { getTemporaryConfigTemplate } from "./api/useGetTemporaryConfigTemplate.ts";

export const useSEBSettings = () => {
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
