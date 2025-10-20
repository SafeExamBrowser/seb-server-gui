<template>
    <LoadingFallbackComponent :loading="loading" :errors="errors">
        <StepItem
            :title="$t('createTemplateExam.steps.naming.title')"
            :subtitle="$t('createTemplateExam.steps.naming.subtitle')"
        >
            <v-container
                class="ma-0 pa-0"
                :max-width="useDisplay().thresholds.value.sm"
            >
                <Form
                    v-model="useStepNamingStore().isReady"
                    :fields="formFields"
                />
            </v-container>
        </StepItem>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { useFormFields } from "./composables/useFormFields";
import { useStepNamingStore } from "./composables/store/useStepNamingStore";
import { useDisplay } from "vuetify";

const { formFields, loading, errors } = useFormFields();
</script>
