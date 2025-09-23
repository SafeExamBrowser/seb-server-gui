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
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";

const { t } = useI18n();
const {
    name: modelName,
    description: modelDescription,
    examType: modelExamType,
} = storeToRefs(useStepNamingStore());

// TODO @alain: add all fields here, extend Form component
// TODO @alain: deal with validation and proper displaying of required fields
// TODO @alain: "isReady" of the step should be based on the form being valid
const formFields = computed<FormField[]>(() => [
    {
        type: "text" as const,
        name: "name",
        model: modelName,
        label: t("createTemplateExam.steps.naming.fields.name.label"),
        placeholder: t(
            "createTemplateExam.steps.naming.fields.name.placeholder",
        ),
        required: true,
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
    {
        type: "select" as const,
        name: "examType",
        model: modelExamType,
        options: Object.values(ExamTypeEnum).map((enumValue) => ({
            value: enumValue,
            text: t(enumValue),
        })),
        label: t("createTemplateExam.steps.naming.fields.examType.label"),
        placeholder: t(
            "createTemplateExam.steps.naming.fields.examType.placeholder",
        ),
        required: true,
    },
]);
</script>
