import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { FormField } from "@/components/views/seb-server/template/exam/components/form/types";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { useClientConfigurationNames } from "./api/useClientConfigurationNames";
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
        clientConfiguration: modelClientConfiguration,
        assesmentToolIntegration: modelAssesmentToolIntegration,
        institutionalDefault: modelInstitutionalDefault,
    } = storeToRefs(useStepNamingStore());

    const {
        data: configurationTemplateNames,
        loading: loadingConfigurationTemplateNames,
        error: errorConfigurationTemplateNames,
    } = useConfigurationTemplateNames();

    const {
        data: clientConfigurationNames,
        loading: loadingClientConfigurationNames,
        error: errorClientConfigurationNames,
    } = useClientConfigurationNames();

    const loading = computed(
        () =>
            loadingConfigurationTemplateNames.value ||
            loadingClientConfigurationNames.value,
    );

    const errors = computed(() =>
        [
            errorConfigurationTemplateNames.value,
            errorClientConfigurationNames.value,
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
                name: "clientConfiguration",
                model: modelClientConfiguration,
                options: Object.values(
                    clientConfigurationNames.value ?? [],
                ).map((clientConfiguration) => ({
                    value: clientConfiguration.modelId,
                    text: clientConfiguration.name,
                })),
                label: t(
                    "createTemplateExam.steps.naming.fields.clientConfiguration.label",
                ),
                placeholder: t(
                    "createTemplateExam.steps.naming.fields.clientConfiguration.placeholder",
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
