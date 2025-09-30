import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { FormField } from "@/components/views/seb-server/template/exam/components/form/types";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { useConnectionConfigurationNames } from "./api/useConnectionConfigurationNames";
import { useConfigurationTemplateNames } from "./api/useConfigurationTemplateNames";
import { storeToRefs } from "pinia";
import { useStepNamingStore } from "./store/useStepNamingStore";

export const useFormFields = () => {
    const { t } = useI18n();

    const {
        name: modelName,
        description: modelDescription,
        examType: modelExamType,
        configurationTemplate: modelConfigurationTemplate,
        connectionConfiguration: modelConnectionConfiguration,
        assesmentToolIntegration: modelAssesmentToolIntegration,
        institutionalDefault: modelInstitutionalDefault,
    } = storeToRefs(useStepNamingStore());

    const {
        data: configurationTemplateNames,
        loading: loadingConfigurationTemplateNames,
        error: errorConfigurationTemplateNames,
    } = useConfigurationTemplateNames();

    const {
        data: connectionConfigurationNames,
        loading: loadingConnectionConfigurationNames,
        error: errorConnectionConfigurationNames,
    } = useConnectionConfigurationNames();

    const loading = computed(
        () =>
            loadingConfigurationTemplateNames.value ||
            loadingConnectionConfigurationNames.value,
    );

    const errors = computed(() =>
        [
            errorConfigurationTemplateNames.value,
            errorConnectionConfigurationNames.value,
        ].filter((error) => error !== undefined),
    );

    const formFields = computed<FormField[]>(() => {
        if (loading.value) {
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
                label: t(
                    "createTemplateExam.steps.naming.fields.examType.label",
                ),
                placeholder: t(
                    "createTemplateExam.steps.naming.fields.examType.placeholder",
                ),
                required: true,
            },
            {
                type: "select" as const,
                name: "configurationTemplate",
                model: modelConfigurationTemplate,
                options: Object.values(
                    configurationTemplateNames.value ?? [],
                ).map((configurationTemplate) => ({
                    value: configurationTemplate.modelId,
                    text: configurationTemplate.name,
                })),
                label: t(
                    "createTemplateExam.steps.naming.fields.configurationTemplate.label",
                ),
                placeholder: t(
                    "createTemplateExam.steps.naming.fields.configurationTemplate.placeholder",
                ),
            },
            {
                type: "select" as const,
                name: "connectionConfiguration",
                model: modelConnectionConfiguration,
                options: Object.values(
                    connectionConfigurationNames.value ?? [],
                ).map((connectionConfiguration) => ({
                    value: connectionConfiguration.modelId,
                    text: connectionConfiguration.name,
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

    return {
        formFields,
        loading,
        errors,
    };
};
