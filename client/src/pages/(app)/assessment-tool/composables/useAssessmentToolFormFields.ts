import { computed, ref, watch } from "vue";
import i18n from "@/i18n";
import type { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useInstitutions } from "@/composables/useInstitutions.ts";
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import {
    assessmentToolCreateSchema,
    LMS_TYPES,
} from "@/models/assessmentTool.ts";
import { ASSESSMENT_TOOL_FIELD } from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";

export type AuthMode = "client" | "token";

export type AssessmentToolFormMode = "create" | "edit";

const t = (key: string) => i18n.global.t(`assessmentToolConnections.${key}`);

export const useAssessmentToolFormFields = (
    mode: AssessmentToolFormMode = "create",
) => {
    const { isRequired, fieldRules } = useZodFormRules();

    const institutionId = ref<string | undefined>(undefined);
    const name = ref<string | undefined>(undefined);
    const lmsType = ref<string | undefined>(undefined);
    const lmsUrl = ref<string | undefined>(undefined);
    const authMode = ref<AuthMode>("token");
    const lmsClientname = ref<string | undefined>(undefined);
    const lmsClientsecret = ref<string | undefined>(undefined);
    const accessToken = ref<string | undefined>(undefined);
    const withProxy = ref<boolean>(false);
    const proxyHost = ref<string | undefined>(undefined);
    const proxyPort = ref<string | undefined>(undefined);
    const proxyUsername = ref<string | undefined>(undefined);
    const proxyPassword = ref<string | undefined>(undefined);

    watch(authMode, (mode) => {
        if (mode === "client") {
            accessToken.value = undefined;
        } else {
            lmsClientname.value = undefined;
            lmsClientsecret.value = undefined;
        }
    });

    const {
        data: institutions,
        loading: loadingInstitutions,
        error: errorInstitutions,
    } = useInstitutions();

    const { data: authenticatedUser } = useCurrentUserQuery();

    watch(
        institutions,
        (data) => {
            if (!data) return;
            const userInstitutionId = String(
                authenticatedUser.value?.institutionId,
            );
            const matched = data.find((i) => i.modelId === userInstitutionId);
            if (matched) {
                institutionId.value = matched.modelId;
            }
        },
        { immediate: true },
    );

    const institutionOptions = computed(() =>
        (institutions.value ?? [])
            .filter(
                (i) =>
                    i.modelId ===
                    String(authenticatedUser.value?.institutionId),
            )
            .map((i) => ({ value: i.modelId, text: i.name })),
    );

    // The value set is derived from the schema enum so it can't drift from the backend;
    // the labels use the domain's established per-type i18n keys.
    const lmsTypeOptions = LMS_TYPES.map((v) => ({
        value: v as string,
        text: t(`lmsTypes.${v}`),
    }));

    const loading = computed(() => loadingInstitutions.value);
    const errors = computed(() =>
        [errorInstitutions.value].filter((e) => e !== undefined),
    );

    const mainFormFields = computed<FormField[]>(() => {
        if (loading.value) return [];
        return [
            {
                type: "select" as const,
                name: ASSESSMENT_TOOL_FIELD.institutionId,
                model: institutionId,
                label: t("fields.institution.label"),
                options: institutionOptions.value,
                required: true,
                disabled: true,
            },
            {
                type: "text" as const,
                name: ASSESSMENT_TOOL_FIELD.name,
                model: name,
                label: t("fields.name.label"),
                required: isRequired(assessmentToolCreateSchema.shape.name),
                rules: fieldRules(assessmentToolCreateSchema.shape.name),
            },
            {
                type: "select" as const,
                name: ASSESSMENT_TOOL_FIELD.lmsType,
                model: lmsType,
                label: t("fields.type.label"),
                options: lmsTypeOptions,
                required: isRequired(assessmentToolCreateSchema.shape.lmsType),
                disabled: mode === "edit",
            },
            {
                type: "text" as const,
                name: ASSESSMENT_TOOL_FIELD.lmsUrl,
                model: lmsUrl,
                label: t("fields.serverAddress.label"),
                required: true,
                rules: [
                    (v: string | undefined) =>
                        !v ||
                        /^https?:\/\//i.test(v) ||
                        t("fields.serverAddress.validation"),
                ],
            },
        ];
    });

    const authFormFields = computed<FormField[]>(() => {
        if (authMode.value === "client") {
            return [
                {
                    type: "text" as const,
                    name: ASSESSMENT_TOOL_FIELD.lmsClientname,
                    model: lmsClientname,
                    label: t("fields.clientUsername.label"),
                    required: true,
                },
                {
                    type: "password" as const,
                    name: ASSESSMENT_TOOL_FIELD.lmsClientsecret,
                    model: lmsClientsecret,
                    label: t("fields.clientPassword.label"),
                    required: true,
                },
            ];
        }
        return [
            {
                type: "password" as const,
                name: ASSESSMENT_TOOL_FIELD.accessToken,
                model: accessToken,
                label: t("fields.accessToken.label"),
                required: true,
            },
        ];
    });

    const proxyFormFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: ASSESSMENT_TOOL_FIELD.proxyHost,
            model: proxyHost,
            label: t("fields.proxyHost.label"),
            placeholder: t("fields.proxyHost.placeholder"),
            required: true,
        },
        {
            type: "text" as const,
            name: ASSESSMENT_TOOL_FIELD.proxyPort,
            model: proxyPort,
            label: t("fields.proxyPort.label"),
            placeholder: t("fields.proxyPort.placeholder"),
            required: true,
            rules: [
                (v: string | undefined) => {
                    if (!v) return t("validation.required");
                    const n = Number(v);
                    return (
                        (Number.isInteger(n) && n >= 1 && n <= 65535) ||
                        t("fields.proxyPort.validation")
                    );
                },
            ],
        },
        {
            type: "text" as const,
            name: ASSESSMENT_TOOL_FIELD.proxyUsername,
            model: proxyUsername,
            label: t("fields.proxyUsername.label"),
            placeholder: t("fields.proxyUsername.placeholder"),
            required: true,
        },
        {
            type: "password" as const,
            name: ASSESSMENT_TOOL_FIELD.proxyPassword,
            model: proxyPassword,
            label: t("fields.proxyPassword.label"),
            placeholder: t("fields.proxyPassword.placeholder"),
            required: true,
        },
    ]);

    return {
        mainFormFields,
        authFormFields,
        proxyFormFields,
        authMode,
        withProxy,
        loading,
        errors,
        institutionId,
        name,
        lmsType,
        lmsUrl,
        lmsClientname,
        lmsClientsecret,
        accessToken,
        proxyHost,
        proxyPort,
        proxyUsername,
        proxyPassword,
    };
};
