<template>
    <StepItem
        :title="$t('createTemplateExam.steps.seb-settings.title')"
        :subtitle="$t('createTemplateExam.steps.seb-settings.subtitle')"
    >
        <v-container class="ma-0 pa-0" :max-width="thresholds.xxl">
            <LoadingFallbackComponent :loading="loading" :errors="errors">
                <SEBSettings v-model="temporaryConfigTemplateKey" />
            </LoadingFallbackComponent>
        </v-container>
    </StepItem>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";

import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";

import SEBSettings from "./components/SEBSettings.vue";
import { useSEBSettings } from "./composables/useSEBSettings.ts";

const { temporaryConfigTemplateKey, loading, errors } = useSEBSettings();

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);
</script>
