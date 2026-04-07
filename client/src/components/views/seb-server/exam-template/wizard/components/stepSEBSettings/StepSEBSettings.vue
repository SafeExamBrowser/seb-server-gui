<template>
    <StepItem
        :title="$t('createTemplateExam.steps.seb-settings.title')"
        :subtitle="$t('createTemplateExam.steps.seb-settings.subtitle')"
    >
        <v-container
            class="ma-0 pa-0"
            :max-width="useDisplay().thresholds.value.sm"
        >
            <LoadingFallbackComponent :loading="loading" :errors="errors">
                <SEBSettings />
            </LoadingFallbackComponent>
        </v-container>
    </StepItem>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
//import { useFormFields } from "./composables/useFormFields";
//import { useStepNamingStore } from "./composables/store/useStepNamingStore";
import { useDisplay } from "vuetify";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import SEBSettings from "./composables/SEBSettings.vue";
import { createTemporaryConfigTemplate } from "./composables/api/useCreateTemporaryConfigTemplate";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { useStepNamingStore } from "@/components/views/seb-server/exam-template/wizard/components/stepNaming/composables/store/useStepNamingStore";

//import SebSettingsDialog from "@/components/views/seb-server/settings/SebSettingsDialog.vue";

//const { formFields, loading, errors } = SEBSettings.();

const {
    data: temporaryConfigTemplateKey,
    loading: loadingTemporaryConfigTemplateKey,
    error: errorTemporaryConfigTemplateKey,
} = createTemporaryConfigTemplate();

const sebSettingsStore = useSEBSettingsStore();
const stepNamingStore = useStepNamingStore();

const loading = computed(() => loadingTemporaryConfigTemplateKey.value);

const errors = computed(() =>
    [errorTemporaryConfigTemplateKey.value].filter(
        (error) => error !== undefined,
    ),
);

onBeforeMount(async () => {
    console.info("*********** StepSEBSettings onBeforeMount");

    sebSettingsStore.$reset();
    sebSettingsStore.isExam = false;
    sebSettingsStore.readonly = false;
    if (temporaryConfigTemplateKey.value) {
        sebSettingsStore.selectedContainerId = parseInt(
            temporaryConfigTemplateKey.value.modelId,
        );
        stepNamingStore.configurationTemplate =
            temporaryConfigTemplateKey.value.modelId;
    }
});
</script>
