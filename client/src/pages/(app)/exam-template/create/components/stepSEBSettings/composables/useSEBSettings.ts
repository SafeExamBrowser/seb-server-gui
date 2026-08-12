import { computed, onMounted, ref } from "vue";

import type { ConfigurationTemplateKey } from "@/models/examTemplate.ts";
import { useCreateTemporaryConfigTemplateMutation } from "@/pages/(app)/exam-template/api/useCreateTemporaryConfigTemplateMutation.ts";
import { useStepNamingStore } from "@/pages/(app)/exam-template/create/components/stepNaming/composables/store/useStepNamingStore.ts";
import {
    toAppError,
    toAppErrorOrUndefined,
} from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import { getConfigurationTemplate } from "@/services/seb-server/configurationNodeService.ts";

export const useSEBSettings = () => {
    const stepNamingStore = useStepNamingStore();

    const temporaryConfigTemplateKey = ref<ConfigurationTemplateKey>();
    const existingTemplateLoading = ref(false);
    const existingTemplateError = ref<AppError>();

    const createTemporaryConfigTemplateMutation =
        useCreateTemporaryConfigTemplateMutation();

    onMounted(async () => {
        const existingTemplateId = stepNamingStore.configurationTemplate;

        if (existingTemplateId) {
            existingTemplateLoading.value = true;
            try {
                const template =
                    await getConfigurationTemplate(existingTemplateId);
                temporaryConfigTemplateKey.value = {
                    id: Number(template.id),
                    name: template.name,
                };
            } catch (error) {
                existingTemplateError.value = toAppError(error);
            } finally {
                existingTemplateLoading.value = false;
            }
            return;
        }

        try {
            temporaryConfigTemplateKey.value =
                await createTemporaryConfigTemplateMutation.mutateAsync();
        } catch {
            /* surfaced via the mutation error below */
        }
    });

    const loading = computed(
        () =>
            existingTemplateLoading.value ||
            createTemporaryConfigTemplateMutation.isPending.value,
    );

    const errors = computed(() =>
        [
            existingTemplateError.value,
            toAppErrorOrUndefined(
                createTemporaryConfigTemplateMutation.error.value,
            ),
        ].filter((error) => error !== undefined),
    );

    return {
        temporaryConfigTemplateKey,
        loading,
        errors,
    };
};
