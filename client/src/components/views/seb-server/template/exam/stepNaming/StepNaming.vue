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
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStepNamingStore } from "./store";
import { FormField } from "../components/form/types";
import { storeToRefs } from "pinia";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { useConnectionConfigurations } from "./composables/useConnectionConfigurations";
import { useSebClientTemplates } from "@/components/views/seb-server/template/exam/stepNaming/composables/useSebClientTemplates";

const { t } = useI18n();

const {
    name: modelName,
    description: modelDescription,
    examType: modelExamType,
    sebClientTemplate: modelSebClientTemplate,
    connectionConfiguration: modelConnectionConfiguration,
    assesmentToolIntegration: modelAssesmentToolIntegration,
    institutionalDefault: modelInstitutionalDefault,
} = storeToRefs(useStepNamingStore());

const {
    data: sebClientTemplates,
    loading: loadingSebClientTemplates,
    error: errorSebClientTemplates,
} = useSebClientTemplates();

const {
    data: connectionConfigurations,
    loading: loadingConnectionConfigurations,
    error: errorConnectionConfigurations,
} = useConnectionConfigurations();

const loading = computed(
    () =>
        loadingSebClientTemplates.value ||
        loadingConnectionConfigurations.value,
);

const errors = computed(() =>
    [errorSebClientTemplates.value, errorConnectionConfigurations.value].filter(
        (error) => error !== undefined,
    ),
);

// TODO @alain: deal with validation and proper displaying of required fields
// TODO @alain: "isReady" of the step should be based on the form being valid
const formFields = computed<FormField[]>(() => {
    if (loadingConnectionConfigurations.value) {
        return [];
    }

    return [
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
            label: t(
                "createTemplateExam.steps.naming.fields.description.label",
            ),
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
        {
            type: "select" as const,
            name: "sebClientTemplate",
            model: modelSebClientTemplate,
            options: Object.values(sebClientTemplates.value ?? []).map(
                (sebClientTemplate) => ({
                    value: sebClientTemplate.id,
                    text: t(sebClientTemplate.name),
                }),
            ),
            label: t(
                "createTemplateExam.steps.naming.fields.sebClientTemplate.label",
            ),
            placeholder: t(
                "createTemplateExam.steps.naming.fields.sebClientTemplate.placeholder",
            ),
        },
        {
            type: "select" as const,
            name: "connectionConfiguration",
            model: modelConnectionConfiguration,
            options: Object.values(
                connectionConfigurations.value?.content ?? [],
            ).map((connectionConfiguration) => ({
                value: connectionConfiguration.id.toString(),
                text: t(connectionConfiguration.name),
            })),
            label: t(
                "createTemplateExam.steps.naming.fields.connectionConfiguration.label",
            ),
            placeholder: t(
                "createTemplateExam.steps.naming.fields.connectionConfiguration.placeholder",
            ),
        },
        {
            type: "switch" as const,
            name: "assesmentToolIntegration",
            model: modelAssesmentToolIntegration,
            label: t(
                "createTemplateExam.steps.naming.fields.assesmentToolIntegration.label",
            ),
        },
        {
            type: "switch" as const,
            name: "institutionalDefault",
            model: modelInstitutionalDefault,
            label: t(
                "createTemplateExam.steps.naming.fields.institutionalDefault.label",
            ),
        },
    ];
});
</script>
