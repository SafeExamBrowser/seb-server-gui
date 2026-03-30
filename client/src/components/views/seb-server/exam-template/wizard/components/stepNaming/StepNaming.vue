<template>
    <StepItem
        :title="$t('createTemplateExam.steps.naming.title')"
        :subtitle="$t('createTemplateExam.steps.naming.subtitle')"
    >
        <v-container
            class="ma-0 pa-0"
            :max-width="useDisplay().thresholds.value.sm"
        >
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
import { useFormFields } from "./composables/useFormFields";
import { useStepNamingStore } from "./composables/store/useStepNamingStore";
import { useDisplay } from "vuetify";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";

const { formFields, loading, errors } = useFormFields();
</script>
