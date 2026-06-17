import { computed, Ref } from "vue";
import { useRules } from "vuetify/labs/rules";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import {
    ExamTypeEnum,
    SELECTABLE_EXAM_TYPES,
} from "@/models/seb-server/examFiltersEnum.ts";
import { useClientConfigurationNames } from "@/composables/useClientConfigurationNames.ts";
import i18n from "@/i18n";
import { useExamTemplateNames } from "./api/useExamTemplateNames.ts";

export const useExamTemplateBasicSettingsFields = (
    models: {
        name: Ref<string | undefined>;
        description: Ref<string | undefined>;
        examType: Ref<ExamTypeEnum | undefined>;
        clientConfiguration: Ref<string | undefined>;
        lmsIntegration: Ref<boolean>;
        institutionalDefault: Ref<boolean>;
    },
    options?: {
        showScreenProctoringEnabled?: Ref<boolean>;
        // name to exclude from the uniqueness check, so an existing template does not flag its own unchanged name as a duplicate (edit mode)
        nameToExcludeFromBlacklist?: Ref<string | undefined>;
    },
) => {
    const {
        data: examTemplateNames,
        loading: loadingExamTemplateNames,
        error: errorExamTemplateNames,
    } = useExamTemplateNames();

    const {
        data: clientConfigurationNames,
        loading: loadingClientConfigurationNames,
        error: errorClientConfigurationNames,
    } = useClientConfigurationNames();

    const loading = computed(
        () =>
            loadingExamTemplateNames.value ||
            loadingClientConfigurationNames.value,
    );

    const errors = computed(() =>
        [
            errorExamTemplateNames.value,
            errorClientConfigurationNames.value,
        ].filter((error) => error !== undefined),
    );

    const blacklistedNames = computed(() => {
        const names = new Set(
            examTemplateNames.value?.map((examTemplate) => examTemplate.name) ??
                [],
        );

        if (options?.nameToExcludeFromBlacklist?.value !== undefined) {
            names.delete(options.nameToExcludeFromBlacklist.value);
        }

        return names;
    });

    const formFields = computed<FormField[]>(() => {
        if (loading.value) {
            return [];
        }

        const fields: FormField[] = [
            {
                type: "text" as const,
                name: "name",
                model: models.name,
                label: i18n.global.t("examTemplate.fields.name.label"),
                placeholder: i18n.global.t(
                    "examTemplate.fields.name.placeholder",
                ),
                required: true,
                rules: [
                    useRules().minLength(3),
                    useRules().maxLength(255),
                    useRules().blacklisted(
                        blacklistedNames.value,
                        i18n.global.t(
                            "examTemplate.fields.name.validationErrorUniqueName",
                        ),
                    ),
                ],
            },
            {
                type: "textarea" as const,
                name: "description",
                model: models.description,
                label: i18n.global.t("examTemplate.fields.description.label"),
                placeholder: i18n.global.t(
                    "examTemplate.fields.description.placeholder",
                ),
                rules: [useRules().maxLength(4000)],
            },
            {
                type: "select" as const,
                name: "examType",
                model: models.examType,
                options: SELECTABLE_EXAM_TYPES.map((enumValue) => ({
                    value: enumValue,
                    text: i18n.global.t(enumValue),
                })),
                label: i18n.global.t("examTemplate.fields.examType.label"),
                placeholder: i18n.global.t(
                    "examTemplate.fields.examType.placeholder",
                ),
            },
            {
                type: "select" as const,
                name: "clientConfiguration",
                model: models.clientConfiguration,
                options: Object.values(
                    clientConfigurationNames.value ?? [],
                ).map((clientConfiguration) => ({
                    value: clientConfiguration.modelId,
                    text: clientConfiguration.name,
                })),
                label: i18n.global.t(
                    "examTemplate.fields.clientConfiguration.label",
                ),
                placeholder: i18n.global.t(
                    "examTemplate.fields.clientConfiguration.placeholder",
                ),
            },
            {
                type: "switch" as const,
                name: "lmsIntegration",
                model: models.lmsIntegration,
                label: i18n.global.t(
                    "examTemplate.fields.lmsIntegration.label",
                ),
            },
            {
                type: "switch" as const,
                name: "institutionalDefault",
                model: models.institutionalDefault,
                label: i18n.global.t(
                    "examTemplate.fields.institutionalDefault.label",
                ),
            },
        ];

        if (options?.showScreenProctoringEnabled !== undefined) {
            fields.push({
                type: "switch" as const,
                name: "screenProctoringEnabled",
                model: options.showScreenProctoringEnabled,
                label: i18n.global.t("screenProctoring.enabled.label"),
            });
        }

        return fields;
    });

    return {
        formFields,
        loading,
        errors,
    };
};
