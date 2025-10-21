import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { useExamTemplateNames } from "./api/useExamTemplateNames";
import { useClientConfigurationNames } from "./api/useClientConfigurationNames";
import { useConfigurationTemplateNames } from "./api/useConfigurationTemplateNames";
import { storeToRefs } from "pinia";
import { useStepNamingStore } from "./store/useStepNamingStore";
import { useRules } from "vuetify/labs/rules";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";

export const useFormFields = () => {
    const { t } = useI18n();

    const {
        name: modelName,
        description: modelDescription,
        examType: modelExamType,
        configurationTemplate: modelConfigurationTemplate,
        clientConfiguration: modelClientConfiguration,
        lmsIntegration: modelLmsIntegration,
        institutionalDefault: modelInstitutionalDefault,
    } = storeToRefs(useStepNamingStore());

    const { enabled: modelScreenProctoringEnabled } = storeToRefs(
        useScreenProctoringStore(),
    );

    const {
        data: examTemplateNames,
        loading: loadingExamTemplateNames,
        error: errorExamTemplateNames,
    } = useExamTemplateNames();

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
            loadingExamTemplateNames.value ||
            loadingConfigurationTemplateNames.value ||
            loadingClientConfigurationNames.value,
    );

    const errors = computed(() =>
        [
            errorExamTemplateNames.value,
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
                rules: [
                    useRules().minLength(3),
                    useRules().maxLength(255),
                    useRules().blacklisted(
                        new Set(
                            examTemplateNames.value?.map(
                                (examTemplate) => examTemplate.name,
                            ) ?? [],
                        ),
                        t(
                            "createTemplateExam.steps.naming.fields.name.validationErrorUniqueName",
                        ),
                    ),
                ],
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
                rules: [useRules().maxLength(4000)],
            },
            {
                type: "select" as const,
                name: "examType",
                model: modelExamType,
                options: [
                    ExamTypeEnum.MANAGED,
                    ExamTypeEnum.BYOD,
                    ExamTypeEnum.VDI,
                ].map((enumValue) => ({
                    value: enumValue,
                    text: t(enumValue),
                })),
                label: t(
                    "createTemplateExam.steps.naming.fields.examType.label",
                ),
                placeholder: t(
                    "createTemplateExam.steps.naming.fields.examType.placeholder",
                ),
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
                name: "lmsIntegration",
                model: modelLmsIntegration,
                label: t(
                    "createTemplateExam.steps.naming.fields.lmsIntegration.label",
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
            {
                type: "switch" as const,
                name: "screenProctoringEnabled",
                model: modelScreenProctoringEnabled,
                label: t(
                    "createTemplateExam.general.fields.screenProctoringEnabled.label",
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
