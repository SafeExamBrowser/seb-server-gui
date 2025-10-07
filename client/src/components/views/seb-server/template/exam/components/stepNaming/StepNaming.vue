<template>
    <LoadingFallbackComponent :loading="loading" :errors="errors">
        <Step
            :title="$t('createTemplateExam.steps.naming.title')"
            :subtitle="$t('createTemplateExam.steps.naming.subtitle')"
        >
            <Form v-model="useStepNamingStore().isReady" :fields="formFields" />
        </Step>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { useFormFields } from "./composables/useFormFields";
import { useStepNamingStore } from "./composables/store/useStepNamingStore";

const { formFields, loading, errors } = useFormFields();
</script>
