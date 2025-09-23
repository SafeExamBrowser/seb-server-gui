<template>
    <Step
        :title="$t('createTemplateExam.steps.naming.title')"
        :subtitle="$t('createTemplateExam.steps.naming.subtitle')"
    >
        <Form :fields="formFields" />
    </Step>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStepNamingStore } from "./store";
import { FormField } from "../components/form/types";
import { storeToRefs } from "pinia";

const { t } = useI18n();
const store = useStepNamingStore();
const { name: modelName, description: modelDescription } = storeToRefs(store);

// TODO @alain: add all fields here, extend Form component
const formFields = computed<FormField[]>(() => [
    {
        type: "text" as const,
        name: "name",
        model: modelName,
        label: t("createTemplateExam.steps.naming.fields.name.label"),
        placeholder: t(
            "createTemplateExam.steps.naming.fields.name.placeholder",
        ),
    },
    {
        type: "textarea" as const,
        name: "description",
        model: modelDescription,
        label: t("createTemplateExam.steps.naming.fields.description.label"),
        placeholder: t(
            "createTemplateExam.steps.naming.fields.description.placeholder",
        ),
    },
]);
</script>
