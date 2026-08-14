import { computed, ref, watch } from "vue";

import type { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { useInstitutions } from "@/composables/useInstitutions.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import i18n from "@/i18n";
import {
    assessmentToolCreateSchema,
    LMS_TYPES,
} from "@/models/assessmentTool.ts";
import { ASSESSMENT_TOOL_FIELD } from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

export type AuthMode = "client" | "token";

const LMS_TYPE_LABEL_I18N_KEYS: Record<(typeof LMS_TYPES)[number], string> = {
    MOCKUP: "assessmentToolConnections.lmsTypes.MOCKUP",
    OPEN_EDX: "assessmentToolConnections.lmsTypes.OPEN_EDX",
    MOODLE: "assessmentToolConnections.lmsTypes.MOODLE",
    MOODLE_PLUGIN: "assessmentToolConnections.lmsTypes.MOODLE_PLUGIN",
    ANS_DELFT: "assessmentToolConnections.lmsTypes.ANS_DELFT",
    OPEN_OLAT: "assessmentToolConnections.lmsTypes.OPEN_OLAT",
};

export type AssessmentToolFormMode = "create" | "edit";

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
        isLoading: loadingInstitutions,
        error: institutionsQueryError,
    } = useInstitutions();
    const errorInstitutions = computed(() =>
        toAppErrorOrUndefined(institutionsQueryError.value),
    );

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
    // the label-key record is keyed by the same enum, so the compiler flags drift there.
    const lmsTypeOptions = LMS_TYPES.map((value) => ({
        value,
        text: i18n.global.t(LMS_TYPE_LABEL_I18N_KEYS[value]),
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
                label: i18n.global.t(
                    "assessmentToolConnections.fields.institution.label",
                ),
                options: institutionOptions.value,
                required: true,
                disabled: true,
            },
            {
                type: "text" as const,
                name: ASSESSMENT_TOOL_FIELD.name,
                model: name,
                label: i18n.global.t(
                    "assessmentToolConnections.fields.name.label",
                ),
                required: isRequired(assessmentToolCreateSchema.shape.name),
                rules: fieldRules(assessmentToolCreateSchema.shape.name),
            },
            {
                type: "select" as const,
                name: ASSESSMENT_TOOL_FIELD.lmsType,
                model: lmsType,
                label: i18n.global.t(
                    "assessmentToolConnections.fields.type.label",
                ),
                options: lmsTypeOptions,
                required: isRequired(assessmentToolCreateSchema.shape.lmsType),
                disabled: mode === "edit",
            },
            {
                type: "text" as const,
                name: ASSESSMENT_TOOL_FIELD.lmsUrl,
                model: lmsUrl,
                label: i18n.global.t(
                    "assessmentToolConnections.fields.serverAddress.label",
                ),
                required: true,
                rules: [
                    (v: string | undefined) =>
                        !v ||
                        /^https?:\/\//i.test(v) ||
                        i18n.global.t(
                            "assessmentToolConnections.fields.serverAddress.validation",
                        ),
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
                    label: i18n.global.t(
                        "assessmentToolConnections.fields.clientUsername.label",
                    ),
                    required: true,
                },
                {
                    type: "password" as const,
                    name: ASSESSMENT_TOOL_FIELD.lmsClientsecret,
                    model: lmsClientsecret,
                    label: i18n.global.t(
                        "assessmentToolConnections.fields.clientPassword.label",
                    ),
                    required: true,
                },
            ];
        }
        return [
            {
                type: "password" as const,
                name: ASSESSMENT_TOOL_FIELD.accessToken,
                model: accessToken,
                label: i18n.global.t(
                    "assessmentToolConnections.fields.accessToken.label",
                ),
                required: true,
            },
        ];
    });

    const proxyFormFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: ASSESSMENT_TOOL_FIELD.proxyHost,
            model: proxyHost,
            label: i18n.global.t(
                "assessmentToolConnections.fields.proxyHost.label",
            ),
            placeholder: i18n.global.t(
                "assessmentToolConnections.fields.proxyHost.placeholder",
            ),
            required: true,
        },
        {
            type: "text" as const,
            name: ASSESSMENT_TOOL_FIELD.proxyPort,
            model: proxyPort,
            label: i18n.global.t(
                "assessmentToolConnections.fields.proxyPort.label",
            ),
            placeholder: i18n.global.t(
                "assessmentToolConnections.fields.proxyPort.placeholder",
            ),
            required: true,
            rules: [
                (v: string | undefined) => {
                    if (!v) {
                        return i18n.global.t(
                            "assessmentToolConnections.validation.required",
                        );
                    }
                    const n = Number(v);
                    return (
                        (Number.isInteger(n) && n >= 1 && n <= 65535) ||
                        i18n.global.t(
                            "assessmentToolConnections.fields.proxyPort.validation",
                        )
                    );
                },
            ],
        },
        {
            type: "text" as const,
            name: ASSESSMENT_TOOL_FIELD.proxyUsername,
            model: proxyUsername,
            label: i18n.global.t(
                "assessmentToolConnections.fields.proxyUsername.label",
            ),
            placeholder: i18n.global.t(
                "assessmentToolConnections.fields.proxyUsername.placeholder",
            ),
            required: true,
        },
        {
            type: "password" as const,
            name: ASSESSMENT_TOOL_FIELD.proxyPassword,
            model: proxyPassword,
            label: i18n.global.t(
                "assessmentToolConnections.fields.proxyPassword.label",
            ),
            placeholder: i18n.global.t(
                "assessmentToolConnections.fields.proxyPassword.placeholder",
            ),
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
