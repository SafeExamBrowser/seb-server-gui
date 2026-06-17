<template>
    <StepItem
        :title="$t('createExam.steps.withURL.title')"
        :subtitle="$t('createExam.steps.withURL.subtitle')"
        :text="$t('createExam.steps.withURL.text')"
        :manual-scroll-management="true"
    >
        <v-container
            class="ma-0 pa-0"
            :max-width="useDisplay().thresholds.value.sm"
        >
            <FormBuilder :fields="formFields" />
        </v-container>
    </StepItem>
</template>

<script setup lang="ts">
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import { useFormFields } from "@/pages/(app)/exam/create/components/stepWithURL/composables/useFormFields";
import { useDisplay } from "vuetify";

const { formFields } = useFormFields();
</script>
