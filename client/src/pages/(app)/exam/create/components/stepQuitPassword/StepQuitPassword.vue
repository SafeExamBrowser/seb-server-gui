<template>
    <StepItem
        :title="$t('createExam.steps.quitPassword.title')"
        :subtitle="$t('createExam.steps.quitPassword.subtitle')"
    >
        <v-container fluid class="ma-0 pa-0 pb-6" :max-width="thresholds.sm">
            <v-alert
                class="mb-4"
                type="info"
                variant="tonal"
                :text="$t('createExam.steps.quitPassword.warning')"
            />
            <FormBuilder :fields="formFields" />
            <div
                v-if="showImportedHint"
                class="text-caption text-medium-emphasis mt-1"
            >
                {{ $t("createExam.steps.quitPassword.importedHint") }}
            </div>
        </v-container>
    </StepItem>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";

import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";

import { useStepQuitPasswordStore } from "./composables/store/useStepQuitPasswordStore.ts";
import { useFormFields } from "./composables/useFormFields.ts";

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);
const { formFields } = useFormFields();

const store = useStepQuitPasswordStore();

const showImportedHint = computed(
    () =>
        store.templateQuitPassword !== "" &&
        store.quitPassword === store.templateQuitPassword,
);
</script>
