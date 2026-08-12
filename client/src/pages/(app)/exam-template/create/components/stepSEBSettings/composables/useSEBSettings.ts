import { computed, ref } from "vue";

import type { ConfigurationTemplateKey } from "@/models/examTemplate.ts";
import { useCreateTemporaryConfigTemplateMutation } from "@/pages/(app)/exam-template/api/useCreateTemporaryConfigTemplateMutation.ts";
import { useStepNamingStore } from "@/pages/(app)/exam-template/create/components/stepNaming/composables/store/useStepNamingStore.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import { getConfigurationTemplate } from "@/services/seb-server/configurationNodeService.ts";

export const useSEBSettings = () => {
    const stepNamingStore = useStepNamingStore();

    const temporaryConfigTemplateKey = ref<ConfigurationTemplateKey>();
    // starts true so the settings panel never mounts (and fetches) before the
    // configuration template id is known
    const loading = ref(true);
    const error = ref<AppError>();

    const createTemporaryConfigTemplateMutation =
        useCreateTemporaryConfigTemplateMutation();

    const initialize = async () => {
        try {
            const existingTemplateId = stepNamingStore.configurationTemplate;

            if (existingTemplateId) {
                const template =
                    await getConfigurationTemplate(existingTemplateId);
                temporaryConfigTemplateKey.value = {
                    id: Number(template.id),
                    name: template.name,
                };
                return;
            }

            temporaryConfigTemplateKey.value =
                await createTemporaryConfigTemplateMutation.mutateAsync();
        } catch (initializeError) {
            error.value = toAppError(initializeError);
        } finally {
            loading.value = false;
        }
    };

    void initialize();

    const errors = computed(() =>
        [error.value].filter((initError) => initError !== undefined),
    );

    return {
        temporaryConfigTemplateKey,
        loading,
        errors,
    };
};
