<template>
    <StepItem
        :title="$t('createTemplateExam.steps.naming.title')"
        :subtitle="$t('createTemplateExam.steps.naming.subtitle')"
    >
        <v-container class="ma-0 pa-0" :max-width="thresholds.sm">
            <LoadingFallbackComponent :loading="loading" :errors="errors">
                <FormBuilder
                    v-model="useStepNamingStore().isReady"
                    :fields="formFields"
                />
            </LoadingFallbackComponent>
        </v-container>
    </StepItem>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";

import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";

import { useStepNamingStore } from "./composables/store/useStepNamingStore.ts";
import { useFormFields } from "./composables/useFormFields.ts";

const { formFields, loading, errors } = useFormFields();

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);
</script>
