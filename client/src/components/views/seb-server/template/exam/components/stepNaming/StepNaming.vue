<template>
    <LoadingFallbackComponent :loading="loading" :errors="errors">
        <Step
            :title="$t('createTemplateExam.steps.naming.title')"
            :subtitle="$t('createTemplateExam.steps.naming.subtitle')"
        >
            <Form :fields="formFields" />
        </Step>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { useFormFields } from "./composables/useFormFields";

// TODO @alain: deal with validation
// TODO @alain: "isReady" of the step should be based on the form being valid
const { formFields, loading, errors } = useFormFields();
</script>
