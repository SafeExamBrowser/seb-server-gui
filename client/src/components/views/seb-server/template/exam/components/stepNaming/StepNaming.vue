<template>
    <LoadingFallbackComponent :loading="loading" :errors="errors">
        <StepItem
            :title="$t('createTemplateExam.steps.naming.title')"
            :subtitle="$t('createTemplateExam.steps.naming.subtitle')"
        >
            <FormBuilder
                v-model="useStepNamingStore().isReady"
                :fields="formFields"
            />
        </StepItem>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { useFormFields } from "./composables/useFormFields";
import { useStepNamingStore } from "./composables/store/useStepNamingStore";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";

const { formFields, loading, errors } = useFormFields();
</script>
