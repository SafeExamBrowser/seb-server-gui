import { computed, ref, watch } from "vue";
import i18n from "@/i18n";
import type { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useInstitutions } from "@/composables/useInstitutions.ts";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore.ts";
import { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums.ts";

export type AuthMode = "client" | "token";

export type AssessmentToolFormMode = "create" | "edit";

export const useAssessmentToolFormFields = (
    mode: AssessmentToolFormMode = "create",
) => {
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

    const authenticatedUser = useUserAccountStore().userAccount;

    watch(
        institutions,
        (data) => {
            if (!data) return;
            const userInstitutionId = String(authenticatedUser?.institutionId);
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
                (i) => i.modelId === String(authenticatedUser?.institutionId),
            )
            .map((i) => ({ value: i.modelId, text: i.name })),
    );

    const lmsTypeOptions = Object.values(LMSTypeEnum).map((v) => ({
        value: v as string,
        text: i18n.global.t(`assessmentToolConnections.lmsTypes.${v}`),
    }));

    const t = (key: string) =>
        i18n.global.t(`assessmentToolConnections.${key}`);

    const loading = computed(() => loadingInstitutions.value);
    const errors = computed(() =>
        [errorInstitutions.value].filter((e) => e !== undefined),
    );

    const mainFormFields = computed<FormField[]>(() => {
        if (loading.value) return [];
        return [
            {
                type: "select" as const,
                name: "institutionId",
                model: institutionId,
                label: t("fields.institution.label"),
                options: institutionOptions.value,
                required: true,
                disabled: true,
            },
            {
                type: "text" as const,
                name: "name",
                model: name,
                label: t("fields.name.label"),
                required: true,
            },
            {
                type: "select" as const,
                name: "lmsType",
                model: lmsType,
                label: t("fields.type.label"),
                options: lmsTypeOptions,
                required: true,
                disabled: mode === "edit",
            },
            {
                type: "text" as const,
                name: "lmsUrl",
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
                    name: "lmsClientname",
                    model: lmsClientname,
                    label: t("fields.clientUsername.label"),
                    required: true,
                },
                {
                    type: "password" as const,
                    name: "lmsClientsecret",
                    model: lmsClientsecret,
                    label: t("fields.clientPassword.label"),
                    required: true,
                },
            ];
        }
        return [
            {
                type: "password" as const,
                name: "accessToken",
                model: accessToken,
                label: t("fields.accessToken.label"),
                required: true,
            },
        ];
    });

    const proxyFormFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: "proxyHost",
            model: proxyHost,
            label: t("fields.proxyHost.label"),
            placeholder: t("fields.proxyHost.placeholder"),
            required: true,
        },
        {
            type: "text" as const,
            name: "proxyPort",
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
            name: "proxyUsername",
            model: proxyUsername,
            label: t("fields.proxyUsername.label"),
            placeholder: t("fields.proxyUsername.placeholder"),
            required: true,
        },
        {
            type: "password" as const,
            name: "proxyPassword",
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
